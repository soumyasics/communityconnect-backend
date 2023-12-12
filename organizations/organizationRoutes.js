const organizationRoutes = require("express").Router();
const {
  organizationCheck,
  organizationSignup,
  organizationLogin,
  getAllOrganizations,
} = require("./organizationController.js");

organizationRoutes.get("/", organizationCheck);
organizationRoutes.post("/signup", organizationSignup);
organizationRoutes.post("/login", organizationLogin);
organizationRoutes.get("/get-all-organizations", getAllOrganizations);
module.exports = organizationRoutes;
