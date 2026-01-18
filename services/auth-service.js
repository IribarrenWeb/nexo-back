/**
 * Servicio de autenticacion
 * - Proporciona funcionalidades para el inicio de sesion de usuarios
 */

const User = require("../models/userModel");
const { generateToken } = require("../utils/helpers");

/**
 * Funcion para iniciar sesion
 * - Busca un usuario por su nombre de usuario
 * - Valida la contraseña proporcionada
 * - Si las credenciales son validas, genera un token JWT
 * - Retorna el usuario y el token generado
 * @param {*} credentials 
 * @returns 
 */
const toLogin = async (credentials) => {
    const { username, password } = credentials;
    const user = await User.findOne({ username: username });

    if (!user || !(await user.validatePassword(password))) {
        throw new Error("Credenciales invalidas");
    }

    const token = generateToken({ userId: user._id, rol: user.rol });

    return {user, token};
};

module.exports = {
    toLogin,
};