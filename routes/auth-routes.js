const express = require("express")

const router = express.Router();

const { login, me } = require("../controllers/auth-controller");
const { protected } = require("../middleware/auth-middleware");

router.post('/login', login)
router.get('/me', protected, me)

module.exports = router