const orphanageRoutes = require("express").Router();
const {
  orphanageCheck,
  orphanageSignup,
  orphanageLogin,
  getAllOrphanages,
} = require("./orphanageController.js");

orphanageRoutes.get("/", orphanageCheck);
orphanageRoutes.post("/signup", orphanageSignup);
orphanageRoutes.post("/login", orphanageLogin);
orphanageRoutes.get("/get-all-orphanages", getAllOrphanages);

module.exports = orphanageRoutes;
