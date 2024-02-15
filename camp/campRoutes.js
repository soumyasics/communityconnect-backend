const campRoutes = require("express").Router();
const {
  createCamp,
  getAllCamps,
  getCampById,
  getCampsByOwnerId,
  participate,
} = require("./campController.js");

campRoutes.get("/check", (req, res) => {
  return res.status(200).json({ message: "camp route working" });
});

campRoutes.post("/create", createCamp);
campRoutes.get("/get-all-camps", getAllCamps);
campRoutes.get("/get-camp-by-id/:id", getCampById);
campRoutes.get("/get-camps-by-owner-id/:id", getCampsByOwnerId);
campRoutes.get("/participate/:id", participate);

module.exports = {
  campRoutes,
};
