const organizationRoutes = require("express").Router();
const { upload } = require("../middleware.js");
const {
  organizationCheck,
  organizationSignup,
  organizationLogin,
  getAllOrganizations,getOrgById
} = require("./organizationController.js");

organizationRoutes.get("/", organizationCheck);
organizationRoutes.post("/signup", upload, organizationSignup);
organizationRoutes.post("/login", organizationLogin);
organizationRoutes.get("/get-all-organizations", getAllOrganizations);
organizationRoutes.get("/get-org-by-id/:id", getOrgById);
module.exports = organizationRoutes;
