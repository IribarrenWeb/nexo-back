const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Notification = require("../models/notificationModel");

dotenv.config();

/**
 * Funcion para generar un token JWT
 * @param {*} payload 
 * @returns Genera un token JWT con el payload proporcionado 
 */
const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "12h" });
}

/**
 * Funcion para decodificar y verificar un token JWT
 * @param {*} token 
 * @returns Decodifica y verifica un token JWT
 */
const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        throw new Error("token invalido");
    }
}

/**
 * Funcion para crear una nueva notificacion
 * - Se crea una nueva instancia del modelo Notification
 * - Se guardan los datos de la notificacion
 * - Se retorna la nueva notificacion creada
 * @param {*} toUserId 
 * @param {*} title 
 * @param {*} message 
 * @param {*} data 
 * @returns Nueva notificacion creada
 */
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

/**
 * Funcion para decodificar una imagen en base64 y guardarla en el sistema de archivos
 * - Se inicializa el modulo fs de nodejs
 * - Se elimina el prefijo de la cadena base64
 * - Se crea un buffer a partir de la cadena base64
 * - Se escribe el archivo en el sistema de archivos
 * - Se retorna la ruta completa del archivo guardado
 * @param {*} base64String 
 * @param {*} filePath 
 * @returns Ruta completa del archivo guardado 
 */
const decodeAndSaveImage = async (base64String, filePath) => {
    const fs = require('fs').promises;
    base64String = base64String.split(';base64,').pop();
    const buffer = Buffer.from(base64String, 'base64');
    const baseSavePath = '../storage/avatars/' + filePath;
    await fs.writeFile(baseSavePath, buffer);
    const fullPath = require('path').resolve(__dirname, baseSavePath);
    return fullPath;
}

module.exports = {
    generateToken,
    verifyToken,
    notificate,
    decodeAndSaveImage,
};