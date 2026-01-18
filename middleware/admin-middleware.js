/**
 * Middleware para proteger rutas de administrador
 * - Verifica que el usuario autenticado tenga rol de 'admin'
 * - Si no tiene el rol adecuado, retorna un error 403
 * - Si tiene el rol adecuado, permite continuar a la siguiente funcion
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const adminProtected = async (req, res, next) => {
    const user = req.user;

    if (user.rol !== 'admin') {
        return res.status(403).json({ mensaje: "Acceso denegado: se requieren privilegios de administrador" });
    }
    next();
};

module.exports = adminProtected;