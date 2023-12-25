const orphanageRoutes = require("express").Router();
const {upload} = require("../middleware.js");
const {
  orphanageCheck,
  orphanageSignup,
  orphanageLogin,
  getAllOrphanages,
} = require("./orphanageController.js");

orphanageRoutes.get("/", orphanageCheck);
orphanageRoutes.post("/signup",upload, orphanageSignup);
orphanageRoutes.post("/login", orphanageLogin);
orphanageRoutes.get("/get-all-orphanages", getAllOrphanages);

module.exports = orphanageRoutes;
