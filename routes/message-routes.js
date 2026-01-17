const express = require("express");
const router = express.Router();

const { store, remove, update, loadChats, messagesFromUser, markRead } = require("../controllers/message-controller");
const { protected } = require("../middleware/auth-middleware");

router.use(protected) // protegemos todas las rutas de mensajes

router.get("/chats", loadChats);
router.get("/chats/:id", messagesFromUser);
router.post("/", store);
router.delete("/:id", remove);
router.put("/mark-read/:fromId", markRead);
router.put("/:id", update);

module.exports = router;
