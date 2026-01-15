const express = require("express");
const router = express.Router();

const { store, remove, index, update, show, showByUsername, toFollow, search } = require("../controllers/userController");
const { protected } = require("../middleware/authMiddleware");
const adminProtected = require("../middleware/adminMiddleware");

router.use(protected); // todas las rutas estan protegidas

router.get("/search", search);
router.get("/", adminProtected, index);
router.get("/by-username/:username", showByUsername);
router.get("/:id", show);
router.post("/", store);
router.delete("/:id", adminProtected, remove);
router.put("/:id", update);
router.put("/follow/:id", toFollow);

module.exports = router;
