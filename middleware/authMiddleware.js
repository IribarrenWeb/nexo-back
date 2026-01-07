const { verifyToken } = require("../utils/helpers");

const User = require("../models/userModel");

const protected = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ mensaje: "No autorizado" });
    }
    const token = authHeader.split(" ")[1];

    try {
        const decoded = verifyToken(token);
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ mensaje: "No autorizado" });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ mensaje: "No autorizado" });
    }
};

module.exports = { protected };