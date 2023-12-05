const express = require("express");
const bodyParser = require("body-parser");
const db = require("./DBConnection");
const app = express();
const cors = require("cors");
const multer = require("multer");
const userRoutes = require("./users/userRoutes.js");
const orphanageRoutes = require("./orphanages/orphanageRoutes.js");

app.use(express.static(`${__dirname}/upload`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.get("/", (req, res) => {
  res.status(200).json({ message: "Tvm Community working" });
});

app.use("/user", userRoutes);
app.use("/orphanage", orphanageRoutes);

app.listen(5000, () => {
  console.log("Server created successfully");
});
