const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { currentUserMiddleware } = require("../middleware/auth");

const router = express.Router();

// Registro
router.post("/register", async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        const user = new User({ first_name, last_name, email, age, password });
        await user.save();
        res.status(201).send("Usuario registrado exitosamente");
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("jwt", token, { httpOnly: true }).send("Login exitoso");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Logout
router.post("/logout", (req, res) => {
    res.clearCookie("jwt").send("Logout exitoso");
});

// Ruta /current con validación
router.get("/current", currentUserMiddleware, (req, res) => {
    const { first_name, last_name, email, age, role } = req.user;
    res.json({
        first_name,
        last_name,
        email,
        age,
        role
    });
});

module.exports = router;
