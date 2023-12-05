const userRoutes = require("express").Router();
const { userSignup, userLogin, userCheck } = require("./userController.js");

userRoutes.get("/", userCheck);
userRoutes.post("/signup", userSignup);
userRoutes.post("/login", userLogin);

module.exports = userRoutes;
