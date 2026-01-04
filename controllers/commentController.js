const Comment = require("../models/commentModel");

const modelName = "Comentario";

const store = async (req, res) => {
    try {
        const { text, postId, usuarioId } = req.body;

        const newModel = new Comment({
            author: usuarioId,
            text: text,
            post: postId,
        });

        await newModel.save();

        res.status(201).json(newModel);
    } catch (error) {
        res.status(500).json({ mensaje: `Error al crear el ${modelName.toLowerCase()}` });
    }
};


const update = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { text } = req.body;
        const model = await Comment.findById(commentId);

        if (!model) {
            return res.status(404).json({ mensaje: `${modelName} no encontrado` });
        }

        model.text = text || model.text;
        await model.save();

        res.status(200).json(model);
    } catch (error) {
        res.status(500).json({ mensaje: `Error al editar el ${modelName.toLowerCase()}` });
    }
};

const show = async (req, res) => {
    try {
        const { commentId } = req.params;
        const model = await Comment.findById(commentId).populate("autor", "nombre usuario");
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
        const { commentId } = req.params;
        const model = await Comment.findByIdAndDelete(commentId);
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
        const models = await Comment.find()
            .populate("author", "nombre usuario")
            .sort({ createdAt: -1 });
        res.status(200).json(models);
    } catch (error) {
        res.status(500).json({ mensaje: `Error al listar los ${modelName.toLowerCase()}` });
    }
};

const toLike = async (req, res) => {
    try {
        const { id } = req.params;
        const { usuarioId } = req.body;
        const model = await Comment.findById(id);
        if (!model) {
            return res.status(404).json({ mensaje: `${modelName} no encontrado` });
        }
        const index = model.likes.indexOf(usuarioId);
        if (index === -1) {
            model.likes.push(usuarioId);
        } else {
            model.likes.splice(index, 1);
        }
        await model.save();
        res.status(200).json(model);
    } catch (error) {
        res.status(500).json({ mensaje: `Error al dar like al ${modelName.toLowerCase()}` });
    }
};

module.exports = { store, update, show, remove, index, toLike };
