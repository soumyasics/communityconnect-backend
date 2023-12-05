const orphanageRoutes = require("express").Router();
const {
  orphanageCheck,
  orphanageSignup,
  orphanageLogin,
} = require("./orphanageController.js");

orphanageRoutes.get("/", orphanageCheck);
orphanageRoutes.post("/signup", orphanageSignup);
orphanageRoutes.post("/login", orphanageLogin);

module.exports = orphanageRoutes;
