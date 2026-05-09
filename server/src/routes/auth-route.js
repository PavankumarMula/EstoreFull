const express = require("express");
const router = express.Router();

const { signIn, refreshToken ,logout,getCurrentUser} = require("../controllers/auth-controller");
const authMiddleware = require("../middlewares/auth-middleware");

router.post("/signin", signIn);
router.post("/refresh-token", refreshToken);
router.post("/signout", logout);
router.post("/getCurrentUser", authMiddleware, getCurrentUser);

module.exports = router;