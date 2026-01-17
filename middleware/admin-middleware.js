const adminProtected = async (req, res, next) => {
    const user = req.user;

    if (user.rol !== 'admin') {
        return res.status(403).json({ mensaje: "Acceso denegado: se requieren privilegios de administrador" });
    }
    next();
};

module.exports = adminProtected;