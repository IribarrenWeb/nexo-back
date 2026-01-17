const express = require("express");
const router = express.Router();

const { store, remove, index, update, show, showByUsername, toFollow, search } = require("../controllers/user-controller");
const { protected } = require("../middleware/auth-middleware");
const adminProtected = require("../middleware/admin-middleware");


router.get("/search", protected, search);
router.get("/", protected, adminProtected, index);
router.get("/by-username/:username", showByUsername);
router.get("/:id", protected, show);
router.post("/", store); // ruta desprotegida para permitir el registro de nuevos usuarios
router.delete("/:id", protected, adminProtected, remove);
router.put("/:id", protected, update);
router.put("/follow/:id", protected, toFollow);

module.exports = router;
