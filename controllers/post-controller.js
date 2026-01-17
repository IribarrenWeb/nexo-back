const Post = require("../models/postModel");
const ValidatorService = require("../services/validator-service");

const store = async (req, res) => {
    try {
        const { content, image } = req.body;
        const usuarioId = req.user._id; // obtenemos el id del usuario autenticado

        // iniciamos el validador
        const validator = new ValidatorService({
            content: { value: content, rules: ['required', 'minLength:1', 'maxLength:280'] },
        });

        // validamos los datos
        const errors = await validator.validate();
        
        if (errors.length) {
            return res.status(403).json({ mensaje: "Errores de validacion", errors });
        }

        const nuevoPost = new Post({
            author: usuarioId,
            content: content,
            image: image,
        });

        await nuevoPost.save();
        
        // cargamos las relaciones
        await nuevoPost.populate([
            {
                path: "author", 
                select: "avatar name lastName username",
            },
            {
                path: "likes",
                select: "avatar name lastName username",
            },
            {
                path: "comments",
            }
        ])

        res.status(201).json(nuevoPost);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear el post" });
    }
};


const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { content, image } = req.body;
        const postExistente = await Post.findById(id);

        if (!postExistente) {
            return res.status(404).json({ mensaje: "Post no encontrado" });
        }
        postExistente.content = content || postExistente.content;
        postExistente.image = image || postExistente.image;
        await postExistente.save();

        res.status(200).json(postExistente);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al editar el post" });
    }
};

const show = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id).populate([
            {
                path:"author",
                select:"avatar name lastName username"
            },
            {
                path: "likes",
                select: "avatar name lastName username",
            },
            {
                path: "comments",
            }
        ]);
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
        const { id } = req.params;
        const postEliminado = await Post.findByIdAndDelete(id);
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
        const { page, limit = 15, userId } = req.query;
        const query = {};
        
        if (userId) {
            query.author = userId;
        }

        const toPage = parseInt(page) || 1;

        const posts = await Post.find(query)
            .skip((toPage - 1) * limit) // paginacion
            .limit(parseInt(limit)) // limite de resultados
            .populate([
                {
                    path:"author", 
                    select:"avatar name lastName username"
                },
                {
                    path: "likes",
                    select: "avatar name lastName username",
                },
                {
                    path: "comments",
                }
            ])
            .sort({ createdAt: -1 });

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al listar los posts" });
    }
};

const toLike = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        const usuarioId = user._id;

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
        await post.populate("likes", "avatar name lastName username");
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al dar like al post" });
    }
};

module.exports = { store, update, show, remove, index, toLike };
