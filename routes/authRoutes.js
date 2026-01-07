const express = require("express")

const router = express.Router();

const { login, me } = require("../controllers/authController");
const { protected } = require("../middleware/authMiddleware");

router.post('/login', login)
router.get('/me', protected, me)

module.exports = router