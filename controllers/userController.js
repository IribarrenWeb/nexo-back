const User = require("../models/userModel");
const mailService = require("../services/mailService");
const ValidatorService = require("../services/validatorService");
const modelName = "Usuario";

const store = async (req, res) => {
    try {
        const { name, lastName, username, email, password, avatar, rol = 'user' } = req.body;

        const validator = new ValidatorService({
            name: { value: name, rules: ['required'] },
            lastName: { value: lastName, rules: ['required'] },
            username: { value: username, rules: ['unique:User,username'] },
            email: { value: email, rules: ['required','unique:User,email'] },
            password: { value: password, rules: ['required'] },
        });

        const errors = await validator.validate();
        if (errors.length) {
            return res.status(403).json({ mensaje: 'Errores de validacion', errors });
        }

        const newModel = new User({
            name: name,
            lastName: lastName,
            username: username,
            email: email,
            password: password,
            avatar: avatar ?? '',
            rol: rol.length ? rol : 'user',
        });

        await newModel.save();

        // Enviar email de bienvenida
        await mailService.sendEmail(
            newModel.email,
            'Bienvenido a Nexo',
            { name: newModel.name },
            'welcome'
        );
        res.status(201).json(newModel);
    } catch (error) {
        res.status(500).json({ mensaje: `Error al crear el ${modelName.toLowerCase()}`, error: error.message });
    }
};


const update = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const { 
            name, 
            lastName, 
            email, 
            username, 
            password, 
            avatar, 
            bio, 
            deactivated,
            rol
        } = req.body;

        const model = await User.findById(userId);

        if (!model) {
            return res.status(404).json({ mensaje: `${modelName} no encontrado` });
        }

        if (name) model.name = name;
        if (lastName) model.lastName = lastName;
        if (email) model.email = email;
        if (username) model.username = username;
        if (password) model.password = password;
        if (avatar) model.avatar = avatar;
        if (bio) model.bio = bio;
        if (deactivated !== undefined) model.deactivated = deactivated;
        if (rol) model.rol = rol;

        await model.save();

        res.status(200).json(model);
    } catch (error) {
        res.status(500).json({ mensaje: `Error al editar el ${modelName.toLowerCase()}` });
    }
};

const show = async (req, res) => {
    try {
        const { userId } = req.params;
        const model = await User.findById(userId);
        if (!model) {
            return res.status(404).json({ mensaje: `${modelName} no encontrado` });
        }
        res.status(200).json(model);
    } catch (error) {
        res.status(500).json({ mensaje: `Error al obtener el ${modelName.toLowerCase()}` });
    }
};

const remove = async (req, res) => {
    try {
        const { userId } = req.params;
        const model = await User.findByIdAndDelete(userId);
        if (!model) {
            return res.status(404).json({ mensaje: `${modelName} no encontrado` });
        }
        res.status(200).json({ mensaje: `${modelName} eliminado correctamente` });
    } catch (error) {
        res.status(500).json({ mensaje: `Error al eliminar el ${modelName}` });
    }
};

const index = async (req, res) => {
    try {
        const params = req.params;
        const models = await User.find(params)
            .sort({ createdAt: -1 });
        res.status(200).json(models);
    } catch (error) {
        res.status(500).json({ mensaje: `Error al listar los ${modelName.toLowerCase()}` });
    }
};

module.exports = { store, update, show, remove, index };
