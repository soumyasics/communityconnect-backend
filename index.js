const express = require("express");
const bodyParser = require("body-parser");
const db = require("./DBConnection");
const app = express();
const cors = require("cors");
const multer = require("multer");
const userRoutes = require("./users/userRoutes.js");
const orphanageRoutes = require("./orphanages/orphanageRoutes.js");
const organizationRoutes = require("./organizations/organizationRoutes.js");
const donationRequestRoutes = require("./donationRequests/donationRequestRoutes.js");
const donationRoutes = require("./donation/donationRoutes.js");

app.use(express.static(`${__dirname}/upload`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.get("/", (req, res) => {
  res.status(200).json({ message: "Tvm Community working" });
});

app.use("/user", userRoutes);
app.use("/orphanage", orphanageRoutes);
app.use("/organization", organizationRoutes);
app.use("/donation", donationRoutes);
app.use("/donation-request", donationRequestRoutes);

app.all("/*", (req, res) => {
  res.status(404).json({ message: "Route not found." });
});
const PORT = 5000;
app.listen(PORT, () => {
  console.log("Server started successfully on port ", PORT);
});
