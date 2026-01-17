const express = require("express");
const router = express.Router();

const { store, remove, index, update, toLike, show } = require("../controllers/comment-controller");

const { protected } = require("../middleware/auth-middleware");
router.use(protected); // protegemos todas las rutas

router.get("/", index);
router.get("/:id", show);
router.post("/", store);
router.put("/like/:id", toLike);
router.delete("/:id", remove);
router.put("/:id", update);

module.exports = router;
