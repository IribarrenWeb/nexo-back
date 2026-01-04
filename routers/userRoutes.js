const express = require("express");
const router = express.Router();

const { store, remove, index, update, toLike, show } = require("../controllers/userController");

router.get("/", index);
router.get("/:id", show);
router.post("/", store);
router.delete("/:id", remove);
router.put("/:id", update);

module.exports = router;
