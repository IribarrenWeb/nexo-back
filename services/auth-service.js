const User = require("../models/userModel");
const { generateToken } = require("../utils/helpers");

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