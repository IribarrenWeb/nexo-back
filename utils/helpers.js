const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Notification = require("../models/notificationModel");

dotenv.config();

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "12h" });
}

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        throw new Error("token invalido");
    }
}

const notificate = async (toUserId, title, message, data) => {
    try {
        const nuevaNotificacion = new Notification({
            data: data,
            title: title,
            message: message,
            user: toUserId,
        });

        await nuevaNotificacion.save();

        return nuevaNotificacion;
    } catch (error) {
        console.error("Error al crear la notificación:", error);
    }
}

module.exports = {
    generateToken,
    verifyToken,
    notificate,
};