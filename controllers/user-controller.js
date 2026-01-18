const User = require("../models/userModel");
const mailService = require("../services/mail-service");
const ValidatorService = require("../services/validator-service");
const { notificate, decodeAndSaveImage } = require("../utils/helpers");
const modelName = "Usuario";

/**
 * Api store para crear un nuevo usuario
 * - Se validan los datos recibidos
 * - Si hay errores de validacion se devuelven
 * - Se crea el nuevo usuario
 * - Se envia un email de bienvenida (si esta configurado el servicio de email)
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns Nuevo usuario creado
 */
const store = async (req, res) => {
    try {
        const { name, lastName, username, email, password, avatar, rol = 'user' } = req.body;

        // iniciamos el validador
        const validator = new ValidatorService({
            name: { value: name, rules: ['required'] },
            lastName: { value: lastName, rules: ['required'] },
            username: { value: username, rules: ['unique:User,username'] },
            email: { value: email, rules: ['required','unique:User,email'] },
            password: { value: password, rules: ['required'] },
        });

        // validamos los datos
        const errors = await validator.validate();
        if (errors.length) {
            return res.status(403).json({ mensaje: 'Errores de validacion', errors });
        }

        // creamos el nuevo usuario
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

        // enviar email de bienvenida
        // asincronamente, no esperamos a que se envie para responder
        mailService.sendEmail(
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

/**
 * Api update para actualizar un usuario
 * - Solo el mismo usuario o un admin pueden actualizarlo
 * - Se valida que el email y username sean unicos
 * - Se actualizan los campos que vengan en el body y cumplan las condiciones
 * - Si hay errores de validacion se devuelven
 * - Se guarda el usuario actualizado
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns Usuario actualizado
 */
const update = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        // extraemos los campos del body que se pueden actualizar
        const { 
            name, 
            lastName, 
            email, 
            username, 
            avatar, 
            bio, 
            deactivated,
            rol
        } = req.body;

        const model = await User.findById(id);
        const isSameUser = user._id == id; // variable para determinar si es el mismo usuario para validaciones
        const isAdmin = user.rol == 'admin'; // variable para determinar si es admin para validaciones

        if (!model) { // si no existe el usuario devolvemos error
            return res.status(404).json({ mensaje: `${modelName} no encontrado` });
        }

        // iniciamos el validador
        const validator = new ValidatorService({
            email: { value: email, rules: [`unique:User,email,${id}`] },
            username: { value: username, rules: [`unique:User,username,${id}`] },
        });

        const errors = []; // iniciamos el array de errores
        
        // actualizamos los campos que vengan en el body y cumplan las condiciones
        if (name && isSameUser) model.name = name;
        if (lastName && isSameUser) model.lastName = lastName;
        if (email && isSameUser) {
            model.email = email;
            const err = await validator.validateField('email'); // validamos email
            if (err) errors.push(err);
        }
        if (username && isSameUser) {
            model.username = username;
            const err = await validator.validateField('username'); // validamos username
            if (err) errors.push(err);
        }
        if (avatar && isSameUser) {
            try {
                const avatarUrl = await decodeAndSaveImage(avatar, 'avatars', `avatar_${model._id}`);
                model.avatar = avatarUrl;
            } catch (error) {
                errors.push({ field: 'avatar', message: error?.message ?? 'Error al guardar la imagen'});                
            }
        }
        if (bio && isSameUser) model.bio = bio;
        if (deactivated !== undefined && isAdmin) model.deactivated = deactivated;
        if (rol && isAdmin) model.rol = rol;

        if (errors.length) { // si hay errores los devolvemos
            return res.status(403).json({ mensaje: 'Errores de validacion', errors });
        }

        await model.save();

        res.status(200).json(model);
    } catch (error) {
        res.status(500).json({ mensaje: `Error al editar el ${modelName.toLowerCase()}` });
    }
};

const show = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await User.findById(id);
        if (!result?.length) {
            return res.status(404).json({ mensaje: `${modelName} no encontrado` });
        }
        const user = result[0]; // obtenemos el primer usuario que coincida
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ mensaje: `Error al obtener el ${modelName.toLowerCase()}` });
    }
};

/**
 * Api showByUsername para obtener un usuario por su username
 * - Si no se encuentra el usuario se devuelve un error 404
 * - Si se encuentra se devuelve el usuario
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns Usuario encontrado
 */
const showByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const result = await User.find({ username: username });
        if (!result?.length) {
            return res.status(404).json({ mensaje: `${modelName} no encontrado` });
        }
        const user = result[0]; // obtenemos el primer usuario que coincida
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ mensaje: `Error al obtener el ${modelName.toLowerCase()}` });
    }
};

const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const model = await User.findByIdAndDelete(id);
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
        const user = req.user;

        params._id = { $ne: user._id }; // excluimos el usuario actual

        const models = await User.find(params)
            .sort({ createdAt: -1 });
        res.status(200).json(models);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: `Error al listar los ${modelName.toLowerCase()}` });
    }
};

/**
 * Api toFollow para seguir/dejar de seguir a un usuario
 * - Si el usuario ya sigue al otro usuario, se deja de seguir
 * - Si el usuario no sigue al otro usuario, se comienza a seguir
 * - Se actualizan los arrays de followers y followings de ambos usuarios para mantener la integridad y consistencia
 * - Se envia una notificacion al usuario seguido/seguido
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns Usuario seguido/seguido y usuario autenticado actualizado
 */
const toFollow = async (req, res) => {
    try {
        const { id } = req.params;
        let user = req.user;
        const userId = req.user._id; // extraemos el id del usuario autenticado
        let model = await User.findById(id); // buscamos el usuario por id
        
        if (!model) {
            return res.status(404).json({ mensaje: `${modelName} no encontrado` });
        }

        // comprobamos si el usuario ya sigue al otro usuario
        const isFollowing = model.followers.some(followerId => followerId.toString() === userId.toString());

        if (!isFollowing) { // no lo sigue, lo añadimos

            // añadimos el follower/following y cargamos el modelo actualizado de model/user
            model = await User.findByIdAndUpdate(id, { $addToSet: { followers: userId } }, {new: true});
            user = await User.findByIdAndUpdate(userId, { $addToSet: { followings: id } }, {new: true});
        } else { // ya lo sigue, lo eliminamos

            // eliminamos el follower/following y cargamos el modelo actualizado de model/user
            model =await User.findByIdAndUpdate(id, { $pull: { followers: userId } },{new: true});
            user = await User.findByIdAndUpdate(userId, { $pull: { followings: id } },{new: true});
        }

        // enviamos notificacion al usuario seguido/seguido
        notificate(model._id, isFollowing ? 'Perdida de seguidor' : 'Nuevo seguidor', `${user.name} ${user.lastName} ha ${isFollowing ? 'dejado de seguirte' : 'comenzado a seguirte'}.`, {referenceModel: 'users', referenceId: user._id, type: isFollowing ? 'unfollow' : 'follow'});

        res.status(200).json({model, user});
    }
    catch (error) {
        res.status(500).json({ mensaje: `Error al actualizar el seguimiento del ${modelName.toLowerCase()}` });
    }
}

/**
 * Api search para buscar usuarios por nombre, apellido, username o email
 * - Se utiliza una expresion regular para busqueda case-insensitive
 * - Se excluye el usuario actual de los resultados
 * - Se devuelve la lista de usuarios encontrados
 * 
 * @param {*} req 
 * @param {*} res 
 */
const search = async (req, res) => {
    try {
        const { q } = req.query;
        const user = req.user;
        const regex = new RegExp(q, 'i'); // expresion regular para busqueda case-insensitive

        const results = await User.aggregate([
            {
                $match: {
                    _id: { $ne: user._id }, // excluimos el usuario actual
                    $or: [
                        { name: regex },
                        { lastName: regex },
                        { username: regex },
                        { email: regex },
                    ]
                }
            }
        ])
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: `Error al buscar los ${modelName.toLowerCase()}` });
    }
}

module.exports = { store, update, show, remove, index, showByUsername, toFollow, search };
