const express = require("express");
const router = express.Router();

const { store, remove, index, update, show, showByUsername, toFollow, search } = require("../controllers/user-controller");
const { protected } = require("../middleware/auth-middleware");
const adminProtected = require("../middleware/admin-middleware");

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
