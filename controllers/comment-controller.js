const Comment = require("../models/commentModel");
const ValidatorService = require("../services/validator-service");

const modelName = "Comentario";

const store = async (req, res) => {
    try {
        const { text, post } = req.body;
        const usuarioId = req.user._id; // obtenemos el id del usuario autenticado

        // iniciamos el validador con reglas
        const validator = new ValidatorService({
            text: { value: text, rules: ['required', 'minLength:1', 'maxLength:280'] },
            post: { value: post, rules: ['required','exists:Post,_id'] },
        });

        // validamos los datos
        const errors = await validator.validate();
        
        // si hay errores, respondemos con ellos
        if (errors.length) {
            return res.status(403).json({ mensaje: "Errores de validacion", errors });
        }

        const newModel = new Comment({
            author: usuarioId,
            text: text,
            post: post,
        });

        await newModel.save();

        // cargamos las relaciones
        await newModel.populate([
            {
                path: "author", 
                select: "avatar name lastName username",
            },
            {
                path: "likes",
                select: "avatar name lastName username",
            },
            {
                path: "post",
            }
        ]);

        res.status(201).json(newModel);
    } catch (error) {
        res.status(500).json({ mensaje: `Error al crear el ${modelName.toLowerCase()}` });
    }
};


const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const model = await Comment.findByIdAndDelete(id);
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
        const { page, limit = 15, post } = req.query;
        const query = {};
        
        if (post) {
            query.post = post;
        }

        const toPage = parseInt(page) || 1;

        const models = await Comment.find(query)
            .skip((toPage - 1) * limit) // paginacion
            .limit(parseInt(limit)) // limite de resultados
            .populate([
                {
                    path: "author", 
                    select: "avatar name lastName username",
                },
                {
                    path: "likes",
                    select: "avatar name lastName username",
                }
            ])
            .sort({ createdAt: -1 });
        res.status(200).json(models);
    } catch (error) {
        res.status(500).json({ mensaje: `Error al listar los ${modelName.toLowerCase()}` });
    }
};

const toLike = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id; // extraemos el id del usuario autenticado
        const model = await Comment.findById(id); // buscamos el comentario por id

        if (!model) {
            return res.status(404).json({ mensaje: `${modelName} no encontrado` });
        }
        const index = model.likes.indexOf(userId); // verificamos si el usuario ya ha dado like
        if (index === -1) { // si no ha dado like, lo añadimos
            model.likes.push(userId);
        } else { // si ya ha dado like, lo removemos
            model.likes.splice(index, 1);
        }

        await model.save();
        
        // cargamos los likes con la info del usuario para la vista
        await model.populate([
            {
                path: "likes",
                select: "avatar name lastName username",
            }
        ]);
        res.status(200).json(model);
    } catch (error) {
        res.status(500).json({ mensaje: `Error al dar like al ${modelName.toLowerCase()}` });
    }
};

module.exports = { store, remove, index, toLike };
