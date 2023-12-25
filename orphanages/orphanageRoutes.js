const orphanageRoutes = require("express").Router();
const {upload} = require("../middleware.js");
const {
  orphanageCheck,
  orphanageSignup,
  orphanageLogin,
  getAllOrphanages,
  getOrphanageById
} = require("./orphanageController.js");

orphanageRoutes.get("/", orphanageCheck);
orphanageRoutes.post("/signup",upload, orphanageSignup);
orphanageRoutes.post("/login", orphanageLogin);
orphanageRoutes.get("/get-all-orphanages", getAllOrphanages);
orphanageRoutes.get("/get-orphanage-by-id/:id", getOrphanageById);
module.exports = orphanageRoutes;
