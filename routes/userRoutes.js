const express = require("express");
const router = express.Router();

const { store, remove, index, update, show, showByUsername } = require("../controllers/userController");
const { protected } = require("../middleware/authMiddleware");
const adminProtected = require("../middleware/adminMiddleware");

router.use(protected); // todas las rutas estan protegidas

router.get("/", adminProtected, index);
router.get("/:id", show);
router.get("/by-username/:username", showByUsername);
router.post("/", store);
router.delete("/:id", adminProtected, remove);
router.put("/:id", update);

module.exports = router;
