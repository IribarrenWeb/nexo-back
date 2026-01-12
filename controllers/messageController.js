const Message = require("../models/messageModel");

const modelName = "Mensaje";

const store = async (req, res) => {
    try {
        const { to, content } = req.body;
        const formId = req.user._id; // obtenemos el id del usuario autenticado

        const newModel = new Message({
            from: formId,
            to: to,
            content: content,
        });

        await newModel.save();
        await newModel.populate("from to", "avatar name lastName username");

        res.status(201).json(newModel);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: `Error al crear el ${modelName.toLowerCase()}` });
    }
};


const update = async (req, res) => {
    try {
        const { id } = req.params;
        
        const { 
            read, 
        } = req.body;

        const model = await Message.findById(id);

        if (!model) {
            return res.status(404).json({ mensaje: `${modelName} no encontrado` });
        }

        await model.save();

        res.status(200).json(model);
    } catch (error) {
        res.status(500).json({ mensaje: `Error al editar el ${modelName.toLowerCase()}` });
    }
};


const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const model = await Message.findByIdAndDelete(id);
        if (!model) {
            return res.status(404).json({ mensaje: `${modelName} no encontrado` });
        }
        res.status(200).json({ mensaje: `${modelName} eliminado correctamente` });
    } catch (error) {
        res.status(500).json({ mensaje: `Error al eliminar el ${modelName}` });
    }
};


/**
 * Funcion para cargar los chats del usuario autenticado
 */
const loadChats = async (req, res) => {
    try {
        const userId = req.user._id; // obtenemos el id del usuario autenticado

        // buscamos todos los mensajes salientes o entrantes del usuario autenticado
        const messages = await Message.find({
            $or: [
                { from: userId },
                { to: userId }
            ]
        })
        .populate("from to", "avatar name lastName username")
        .sort({ createdAt: -1 })
        
        const chats = []; // iniciamos el array de chats

        // recorremos los mensajes y extraemos los usuarios unicos
        messages.forEach(message => {
            const fromId = message.from._id.toString();
            const toId = message.to._id.toString();
            const chattedUserId = fromId == userId ? toId : fromId;
            if (!chats.some((c) => c.userId === chattedUserId)) { // si el usuario no esta en el array, lo agregamos
                chats.push({
                    userId: chattedUserId,
                    user: fromId == userId ? message.to : message.from, // guardamos los datos el usuario con el que se chateo
                    lastMessage: message, // guardamos el ultimo mensaje
                });
            }
        });

        res.status(200).json(chats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: `Error al cargar los chats` });
    }
}

const messagesFromUser = async (req, res) => {
    try {
        const user = req.user;
        const { id, page, limit = 15 } = req.params;
        const toPage = parseInt(page) || 1;

        const messages = await Message.find({
            $or: [
                { from: user._id, to: id },
                { from: id, to: user._id }
            ]
        }).skip((toPage - 1) * limit)
        .limit(parseInt(limit))
        .populate("from to", "avatar name lastName username")
        .sort({ createdAt: -1 }) // ordenamos de mas antiguo a mas reciente

        messages;

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ mensaje: `Error al cargar los mensajes de usuario` });
    }
}


module.exports = { store, update, remove, loadChats, messagesFromUser };
