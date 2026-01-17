const express = require("express");
const router = express.Router();

const { store, remove, index, toLike, show } = require("../controllers/post-controller");
const { protected } = require("../middleware/auth-middleware");

router.use(protected); // todas las rutas estan protegidas

router.get("/", index);
router.get("/:id", show);
router.post("/", store);
router.put("/like/:id", toLike);
router.delete("/:id", remove);

module.exports = router;
