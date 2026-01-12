const express = require("express");
const router = express.Router();

const { store, remove, update, loadChats, messagesFromUser } = require("../controllers/messageController");
const { protected } = require("../middleware/authMiddleware");

router.use(protected) // protegemos todas las rutas de mensajes

router.get("/chats", loadChats);
router.get("/chats/:id", messagesFromUser);
router.post("/", store);
router.delete("/:id", remove);
router.put("/:id", update);

module.exports = router;
