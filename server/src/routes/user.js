const express = require('express');
const router = express.Router();

const {createUser,updateUser,deleteUser,getUserById,getUserDetails} = require ("../controllers/user-controller");

router.post("/",createUser);
router.patch("/:id",updateUser);
router.delete("/:id",deleteUser);
router.get("/:id",getUserById);
router.get("/",getUserDetails);

module.exports = router;



