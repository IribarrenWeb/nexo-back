const ValidatorService = require("../services/validator-service");
const Notification = require("../models/notificationModel");

// marcar notificaciones como leidas
const markRead = async (req, res) => {
    try {
        const user = req.user;

        // marcamos todas las notificaciones del usuario como leidas
        await Notification.updateMany(
            { user: user._id, read: false },
            { $set: { read: true } }
        );

        res.status(200).json({ mensaje: "Notificaciones marcadas como leidas" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error" });
    }
};

// Eliminar una notificacion
const remove = async (req, res) => {
    try {
        const { id } = req.params;

        const notificacion = await Post.findByIdAndDelete(id);
        
        if (!notificacion) {
            return res.status(404).json({ mensaje: "Notification no encontrada" });
        }
        res.status(200).json({ mensaje: "Notificacion eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar la Notificacion" });
    }
};

const index = async (req, res) => {
    try {
        const user = req.user;

        const query = {
            user: user._id, // solo las notificaciones del usuario actual
        }

        const notificaciones = await Notification.find(query)
            .sort({ createdAt: -1 });

        res.status(200).json(notificaciones);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al listar los posts" });
    }
};

module.exports = { markRead, remove, index };
