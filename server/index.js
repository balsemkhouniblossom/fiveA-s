const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserModel = require("./models/User");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library"); // Ajoute cette ligne si elle manque



const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"], // Ajoutez toutes les origines possibles
    methods: ["GET", "POST","PUT"],
    credentials: true
}));

const router = express.Router();
const client = new OAuth2Client("300857414061-8ff3ed18qghlb7r1bcqom4a52ki58ch0.apps.googleusercontent.com");

app.use(cookieParser());

const JWT_SECRET_KEY = "MaSuperCleSecrete123";
const EMAIL_USER = "saif.meddeb.52@gmail.com";
const EMAIL_PASS = "";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "saif.meddeb.52@gmail.com", 
        pass: "oduf dfxn were ycps" 
    },
    tls: {
        rejectUnauthorized: false
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

        const token = jwt.sign({ id: user._id }, JWT_SECRET_KEY, { expiresIn: "2d" });
        const resetUrl = `http://localhost:3000/reset-password/${user._id}/${token}`;

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

app.get("/users", async (req, res) => {
    try {
        const users = await UserModel.find({}, "id name lastName email age phone gender role"); // Sélectionner seulement les champs nécessaires
        if (!users.length) {
            return res.status(404).json({ message: "Aucun utilisateur trouvé" });
        }
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body; // Only updating the role

        const updatedUser = await UserModel.findByIdAndUpdate(
            id,
            { role },
            { new: true } // Returns the updated user
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.json(updatedUser); // Send back the updated user
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

  


app.post("/send_recovery_mail", async (req, res) => {
    try {
        const { recipient_email } = req.body;
        console.log("Email reçu :", recipient_email);

        const user = await UserModel.findOne({ email: recipient_email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const OTP = Math.floor(1000 + Math.random() * 9000);
        console.log("OTP généré :", OTP);

        user.otp = OTP;
        user.otpExpires = Date.now() + 5 * 60 * 1000;
        await user.save();

        const mailOptions = {
            from: EMAIL_USER,
            to: user.email,
            subject: "Votre code de récupération",
            html: `<p>Votre code OTP est : <strong>${OTP}</strong></p>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Erreur d'envoi d'email :", error);
                return res.status(500).json({ message: "Erreur d'envoi d'email", error: error.message });
            }
            console.log("Email envoyé :", info.response);
            res.json({ message: "OTP envoyé avec succès !" });
        });

    } catch (err) {
        console.error("Erreur serveur :", err);
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
});

app.post('/reset-password/:id/:token', async (req, res) => {
    const { id, token } = req.params;
    const { newpassword } = req.body; // Correction ici

    if (!newpassword) {
        return res.json({ Status: "Error", Message: "Nouveau mot de passe requis" });
    }

    jwt.verify(token, JWT_SECRET_KEY, async (err, decoded) => {
        if (err) {
            return res.json({ Status: "Error", Message: "Token invalide ou expiré" });
        }

        try {
            const hashedPassword = await bcrypt.hash(newpassword, 10); // Ajout du `await`
            await UserModel.findByIdAndUpdate(id, { password: hashedPassword }); // Correction de l'update
            res.json({ Status: "Succes" });
        } catch (error) {
            res.json({ Status: "Error", Message: "Erreur lors de la mise à jour du mot de passe" });
        }
    });
});


app.post("/google-login", async (req, res) => {
    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: "300857414061-8ff3ed18qghlb7r1bcqom4a52ki58ch0.apps.googleusercontent.com",
        });

        const payload = ticket.getPayload();
        console.log("Google User:", payload);

        let user = await UserModel.findOne({ email: payload.email });

        if (!user) {
            user = new UserModel({
                email: payload.email,
                name: payload.name,
                role: "PATIENT",
            });
            await user.save();
        }

        const userToken = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET_KEY, { expiresIn: "1h" });

        res.json({ token: userToken, role: user.role });
    } catch (error) {
        console.error("Erreur Google Login:", error);
        res.status(401).json({ message: "Authentification Google échouée." });
    }
});





// 🚀 Démarrage du serveur
app.listen(3001, () => console.log("✅ Server is running on http://localhost:3001"));