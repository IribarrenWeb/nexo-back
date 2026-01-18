const { verifyToken } = require("../utils/helpers");

const User = require("../models/userModel");

/**
 * Middleware para proteger rutas autenticadas
 * - Verifica la presencia y validez del token JWT en el header Authorization
 * - Si el token es valido, busca el usuario asociado y lo adjunta al objeto req
 * - Si no es valido o no existe, retorna un error 401
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const protected = async (req, res, next) => {
    const authHeader = req.headers.authorization; // obtenemos el header Authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) { // verificamos que exista y tenga el formato correcto
        return res.status(401).json({ mensaje: "No autorizado" });
    }

    // extraemos el token del header
    const token = authHeader.split(" ")[1];

    try {
        // verificamos y decodificamos el token
        const decoded = verifyToken(token);

        // buscamos el usuario asociado al token
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) { // si no existe el usuario, retornamos no autorizado
            return res.status(401).json({ mensaje: "No autorizado" });
        }
        req.user = user; // adjuntamos el usuario al objeto req
        next();
    } catch (error) {
        return res.status(401).json({ mensaje: "No autorizado" });
    }
};

module.exports = { protected };