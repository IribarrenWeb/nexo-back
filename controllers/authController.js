const { toLogin } = require("../services/authService");
const User = require("../models/userModel");

const login = async (req, res) => {
    try {
        const credentials = req.body;
        const { user, token } = await toLogin(credentials);
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(401).json({ mensaje: error.message });
    }
};

const me = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener el usuario" });
    }
};

module.exports = {
    login,
    me,
};