const organizationRoutes = require("express").Router();
const { upload } = require("../middleware.js");
const {
  organizationCheck,
  organizationSignup,
  organizationLogin,
  getAllOrganizations,
} = require("./organizationController.js");

organizationRoutes.get("/", organizationCheck);
organizationRoutes.post("/signup", upload, organizationSignup);
organizationRoutes.post("/login", organizationLogin);
organizationRoutes.get("/get-all-organizations", getAllOrganizations);
module.exports = organizationRoutes;
