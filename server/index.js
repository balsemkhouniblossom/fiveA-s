const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserModel = require("./models/User");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"], // Ajoutez toutes les origines possibles
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(cookieParser());

// Clés en dur (⚠️ à modifier avant mise en production)
const JWT_SECRET_KEY = "MaSuperCleSecrete123";
const EMAIL_USER = "emna.borgi@esprit.tn";
const EMAIL_PASS = "*";

// 📧 Configuration de Nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "emna.borgi@esprit.tn", 
        pass: "*" // 🔥 Utilise un mot de passe d'application, pas ton vrai mot de passe Gmail !
    }
});

  
// Connexion à MongoDB
mongoose.connect("mongodb://localhost:27017/lifelink")
    .then(() => console.log("✅ Connecté à MongoDB"))
    .catch(err => console.log("❌ Erreur MongoDB :", err));

// Middleware pour vérifier le token
const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.json("Token is missing");

    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
        if (err) return res.json("Error with token");
        if (decoded.role === "admin") {
            next();
        } else {
            return res.json("Not an admin");
        }
    });
};

// Route d'inscription
app.post("/register", async (req, res) => {
    try {
        const { name, lastName, email, age, gender, phone, password, role } = req.body;

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await UserModel.create({ name, lastName, email, age, gender, phone, password: hashedPassword, role });

        res.status(201).json({ message: "User created successfully", user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route de connexion
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) return res.status(400).json({ message: "No record found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: "Incorrect password" });

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET_KEY, { expiresIn: "1d" });
        res.cookie("token", token, { httpOnly: true, secure: false });

        res.json({ message: "Success", role: user.role, token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route pour réinitialisation du mot de passe
app.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) return res.json({ Status: "User not found" });

        const token = jwt.sign({ id: user._id }, JWT_SECRET_KEY, { expiresIn: "1d" });
        const resetUrl = `http://localhost:5173/reset-password/${user._id}/${token}`;

        const mailOptions = {
            from: EMAIL_USER,
            to: user.email,
            subject: "Reset your password",
            text: `Click the link to reset your password: ${resetUrl}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Error sending email:", error);
                return res.status(500).send({ Status: "Error sending email", error: error.message });
            }
            res.send({ Status: "Success" });
        });
        

    } catch (err) {
        res.json({ error: err.message });
    }
});

// 🚀 Démarrage du serveur
app.listen(3001, () => console.log("✅ Server is running on http://localhost:3001"));