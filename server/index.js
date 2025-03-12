const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserModel = require("./models/User");
const Ambulance = require("./models/Ambulance");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require("google-auth-library"); // Ajoute cette ligne si elle manque
const AmbulanceModel = require("./models/Ambulance");
const MaterialModel = require("./models/Material"); // Adjust the path as necessary



const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"], // Ajoutez toutes les origines possibles
    methods: ["GET", "POST","PUT","DELETE"],
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

app.get('/users/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "ID invalide" });
        }

        const user = await UserModel.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.json(user);
    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
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

        res.json({ message: "Success", role: user.role, name: user.name, token, userId: user._id });
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

// Mise à jour du rôle uniquement
app.put("/users/:id/role", async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const updatedUser = await UserModel.findByIdAndUpdate(id, { role }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
});

// Mise à jour des autres informations de l'utilisateur
app.put("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body; // Exclure `role` ici si nécessaire

        const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
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
    const { newpassword } = req.body; 

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

        res.json({ token: userToken, role: user.role, userId: user._id });
    } catch (error) {
        console.error("Erreur Google Login:", error);
        res.status(401).json({ message: "Authentification Google échouée." });
    }
});


app.get('/api/doctors',async(req,res)=>{
    try {
        const medecins = await UserModel.find({role:"DOCTOR"})
        res.json(medecins)
        
    } catch (error) {
        res.status(500).json({message:"Erreur serveur"});
    }
})

app.get('/api/nurses',async(req,res)=>{
    try {
        const nurses = await UserModel.find({role:"NURSE"})
        res.json(nurses)
        
    } catch (err) {
        res.status(500).json(err)
    }
})

app.get('/api/patients',async(req,res)=>{
    try {
        const patients = await UserModel.find({role:"PATIENT"})
        res.json(patients)
        
    } catch (err) {
        res.status(500).json(err)
        
    }
})
app.delete("/users/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await UserModel.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.status(200).json({ message: "Utilisateur supprimé avec succès", deletedUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.post("/createAmbulance", async (req, res) => {
    try {
        const { model, serie, contact, location } = req.body;

        const existingAmbulance = await Ambulance.findOne({ serie });
        if (existingAmbulance) {
            return res.status(400).json({ message: "Ambulance with this serie already exists" });
        }

        const newAmbulance = await Ambulance.create({
            model,
            serie,
            contact,
            location
        });

        res.status(201).json({
            message: "Ambulance created successfully",
            ambulance: newAmbulance
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get("/ambulances", async (req, res) => {
    try {
        const ambulances = await Ambulance.find({}, "id model serie contact location status"); // Sélectionner seulement les champs nécessaires
        if (!ambulances.length) {
            return res.status(404).json({ message: "Aucune ambulance trouvée" });
        }
        res.status(200).json(ambulances);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.delete("/ambulances/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAmbulance = await AmbulanceModel.findByIdAndDelete(id);

        if (!deletedAmbulance) {
            return res.status(404).json({ message: "Ambulance non trouvé" });
        }

        res.status(200).json({ message: "Ambulance supprimé avec succès", deletedAmbulance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.put("/ambulances/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; 

        const updatedAmbulance = await AmbulanceModel.findByIdAndUpdate(
            id,
            { status },
            { new: true } // Returns the updated ambulance
        );

        if (!updatedAmbulance) {
            return res.status(404).json({ message: "Ambulance non trouvé" });
        }

        res.json(updatedAmbulance); // Send back the updated ambulance
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});


// Create a new material
app.post("/materials", async (req, res) => {
    try {
        const { name, quantity } = req.body;
        const newMaterial = await MaterialModel.create({ name, quantity });
        res.status(201).json({ message: "Material created successfully", material: newMaterial });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all materials
app.get("/materials", async (req, res) => {
    try {
        const materials = await MaterialModel.find({});
        if (!materials.length) {
            return res.status(404).json({ message: "No materials found" });
        }
        res.status(200).json(materials);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a material by ID
app.get("/materials/:id", async (req, res) => {
    try {
        const material = await MaterialModel.findById(req.params.id);
        if (!material) {
            return res.status(404).json({ message: "Material not found" });
        }
        res.json(material);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a material by ID
app.put("/materials/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedMaterial = await MaterialModel.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedMaterial) {
            return res.status(404).json({ message: "Material not found" });
        }

        res.json(updatedMaterial);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a material by ID
app.delete("/materials/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMaterial = await MaterialModel.findByIdAndDelete(id);

        if (!deletedMaterial) {
            return res.status(404).json({ message: "Material not found" });
        }

        res.status(200).json({ message: "Material deleted successfully", deletedMaterial });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
  


// 🚀 Démarrage du serveur
app.listen(3001, () => console.log("✅ Server is running on http://localhost:3001"));
