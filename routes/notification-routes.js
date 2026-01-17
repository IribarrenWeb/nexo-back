const express = require("express");
const router = express.Router();

const { remove, index, markRead} = require("../controllers/notification-controller");
const { protected } = require("../middleware/auth-middleware");

router.use(protected); // todas las rutas estan protegidas

router.get("/", index);
router.get("/mark-read", markRead);
router.delete("/:id", remove);

module.exports = router;
