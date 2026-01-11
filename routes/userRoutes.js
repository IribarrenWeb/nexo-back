const express = require("express");
const router = express.Router();

const { store, remove, index, update, show, showByUsername } = require("../controllers/userController");
const { protected } = require("../middleware/authMiddleware");
const adminProtected = require("../middleware/adminMiddleware");

router.get("/", protected, adminProtected, index);
router.get("/:id", protected, show);
router.get("/by-username/:username", protected, showByUsername);
router.post("/", protected, store);
router.delete("/:id", protected, adminProtected, remove);
router.put("/:id", protected, update);

module.exports = router;
