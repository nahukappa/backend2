const jwt = require("jsonwebtoken");
const User = require("../models/user");

const currentUserMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.jwt; // Extrae el token de las cookies
        if (!token) {
            return res.status(401).json({ error: "No se encontró un token. Acceso no autorizado." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ error: "Usuario no encontrado. Token inválido." });
        }

        req.user = user; // Adjunta el usuario al objeto `req`
        next();
    } catch (error) {
        return res.status(403).json({ error: "Token inválido o expirado." });
    }
};

module.exports = { currentUserMiddleware };
