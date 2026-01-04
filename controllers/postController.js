const Post = require("../models/postModel");

const store = async (req, res) => {
    try {
        const { contenido, imagen, usuarioId } = req.body;

        const nuevoPost = new Post({
            autor: usuarioId,
            contenido: contenido,
            imagen: imagen,
        });

        await nuevoPost.save();

        res.status(201).json(nuevoPost);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear el post" });
    }
};


const update = async (req, res) => {
    try {
        const { postId } = req.params;
        const { contenido, imagen } = req.body;
        const postExistente = await Post.findById(postId);

        if (!postExistente) {
            return res.status(404).json({ mensaje: "Post no encontrado" });
        }
        postExistente.contenido = contenido || postExistente.contenido;
        postExistente.imagen = imagen || postExistente.imagen;
        await postExistente.save();

        res.status(200).json(postExistente);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al editar el post" });
    }
};

const show = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId).populate("autor", "nombre usuario");
        if (!post) {
            return res.status(404).json({ mensaje: "Post no encontrado" });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener el post" });
    }
};

const remove = async (req, res) => {
    try {
        const { postId } = req.params;
        const postEliminado = await Post.findByIdAndDelete(postId);
        if (!postEliminado) {
            return res.status(404).json({ mensaje: "Post no encontrado" });
        }
        res.status(200).json({ mensaje: "Post eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar el post" });
    }
};

const index = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("autor", "nombre usuario")
            .sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al listar los posts" });
    }
};

const toLike = async (req, res) => {
    try {
        const { id } = req.params;
        const { usuarioId } = req.body;
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ mensaje: "Post no encontrado" });
        }
        const index = post.likes.indexOf(usuarioId);
        if (index === -1) {
            post.likes.push(usuarioId);
        } else {
            post.likes.splice(index, 1);
        }
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al dar like al post" });
    }
};

module.exports = { store, update, show, remove, index, toLike };
