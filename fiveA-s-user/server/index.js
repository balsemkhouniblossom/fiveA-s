const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserModel = require('./models/User');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(cookieParser());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'emna.borgi@esprit.tn',  
        pass: '*******' 
    },
    tls: {
        rejectUnauthorized: false
    }
});


mongoose.connect("mongodb://localhost:27017/lifelink")
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log(err));

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json("Token is missing");
    } else {
        jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.json("Error with token");
            } else {
                if (decoded.role === "admin") {
                    next();
                } else {
                    return res.json("Not an admin");
                }
            }
        });
    }
};

app.post('/register', (req, res) => {
    const { email, password } = req.body;
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.json("Error hashing password");
        }
        UserModel.create({ email, password: hashedPassword })
            .then(user => res.json(user))
            .catch(err => res.json(err));
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email: email })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
        console.log("Error comparing password", err);
        res.json("Error comparing password");
    } else {
        console.log("Password match result:", result); 
        if (result) {
            const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET_KEY, { expiresIn: "1d" });
            res.cookie('token', token, { httpOnly: true, secure: false });
            res.json("Success");
        } else {
            res.json("The password is incorrect");
        }
    }
});

            } else {
                res.json("No record found");
            }
        })
        .catch(err => res.json({ error: err.message }));
});



app.post('/forgot-password', (req, res) => {
    const { email } = req.body;
    UserModel.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.send({ Status: "User not found" });
            }

           
            const token = jwt.sign({ id: user._id }, JWT_SECRET_KEY, { expiresIn: "1d" });

            const resetUrl = `http://localhost:5173/reset-password/${user._id}/${token}`;

            

            const mailOptions = {
                from: 'emna.borgi@esprit.tn',
                to: user.email,
                subject: 'Reset your password',
                text: `Click the link to reset your password: ${resetUrl}`
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log("Error details: ", error);  
                    res.send({ Status: "Error sending email" });
                } else {
                    console.log('Email sent: ' + info.response);
                    res.send({ Status: "Success" });
                }
            });
            
        })
        .catch(err => res.json({ error: err.message }));
});

app.listen(3001, () => {
    console.log("Server is running on http://localhost:3001");
});
