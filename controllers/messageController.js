const Message = require("../models/messageModel");

const modelName = "Mensaje";

const store = async (req, res) => {
    try {
        const { formId, toId, content } = req.body;

        const newModel = new Message({
            from: formId,
            to: toId,
            content: content,
        });

        await newModel.save();

        res.status(201).json(newModel);
    } catch (error) {
        res.status(500).json({ mensaje: `Error al crear el ${modelName.toLowerCase()}` });
    }
};


const update = async (req, res) => {
    try {
        const { messageId } = req.params;
        
        const { 
            read, 
        } = req.body;

        const model = await Message.findById(messageId);

        if (!model) {
            return res.status(404).json({ mensaje: `${modelName} no encontrado` });
        }

        await model.save();

        res.status(200).json(model);
    } catch (error) {
        res.status(500).json({ mensaje: `Error al editar el ${modelName.toLowerCase()}` });
    }
};

const show = async (req, res) => {
    try {
        const { messageId } = req.params;
        const model = await Message.findById(messageId);
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
        const { messageId } = req.params;
        const model = await Message.findByIdAndDelete(messageId);
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
        const models = await Message.find()
            .sort({ createdAt: -1 });
        res.status(200).json(models);
    } catch (error) {
        res.status(500).json({ mensaje: `Error al listar los ${modelName.toLowerCase()}` });
    }
};

module.exports = { store, update, show, remove, index };
