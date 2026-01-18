const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Notification = require("../models/notificationModel");
const path = require('path')

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
 * - Valida la carpeta y extension de la imagen
 * - Decodifica la imagen y la guarda en la carpeta especificada
 * - Retorna la ruta completa del archivo guardado
 * 
 * @param {string} base64String 
 * @param {string} folder Carpeta donde se guardara la imagen (avatars o banners)
 * @param {string} fileName Nombre del archivo sin extension
 * @returns Ruta completa del archivo guardado 
 */
const decodeAndSaveImage = async (base64String, folder, fileName) => {
    try {
        const valid_folders = ['avatars', 'banners']; // definir carpetas validas

        if (!valid_folders.includes(folder)) throw new Error('La carpeta no es valida');

        const valid_extensions = ['png', 'jpg', 'jpeg']; // definir extensiones validas
        const extension = base64String.split(';')[0].split('/')[1]; // obtener extension de la imagen
        
        // validar extension
        if (!valid_extensions.includes(extension)) {
            throw new Error('La extension de la imagen no es valida');
        }
        
        const fs = require('fs').promises; // usar la version de promesas del modulo fs para usar async/await
        
        base64String = base64String.split(';base64,').pop(); // eliminar el prefijo de la cadena base64
        
        // definimos el nombre del archivo con la extension correcta
        // para avatares siempre sera png, para banners sera jpg
        fileName = `${fileName}.${folder == 'avatars' ? `png` : 'jpg'}`;

        const buffer = Buffer.from(base64String, 'base64'); // crear un buffer a partir de la cadena base64

        const filePath = path.join(__dirname, "../storage", folder, fileName); // ruta completa del archivo
        
        await fs.writeFile(filePath, buffer); // escribir el archivo
        
        return process.env.BASE_API_URL + `/${folder}/${fileName}`; // retornar la ruta completa del archivo guardado
    } catch (error) {
        throw new Error('Error al guardar la imagen: ' + error.message);
    }
}

module.exports = {
    generateToken,
    verifyToken,
    notificate,
    decodeAndSaveImage,
};