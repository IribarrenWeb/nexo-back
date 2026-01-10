const express = require("express");
const router = express.Router();

const { store, remove, index, update, toLike, show } = require("../controllers/userController");
const { protected } = require("../middleware/authMiddleware");

router.get("/", protected, index);
router.get("/:id", protected, show);
router.post("/", protected, store);
router.delete("/:id", protected, remove);
router.put("/:id", protected, update);

module.exports = router;
