const organizationRoutes = require("express").Router();
const {
  organizationCheck,
  organizationSignup,
  organizationLogin,
} = require("./organizationController.js");

organizationRoutes.get("/", organizationCheck);
organizationRoutes.post("/signup", organizationSignup);
organizationRoutes.post("/login", organizationLogin);

module.exports = organizationRoutes;
