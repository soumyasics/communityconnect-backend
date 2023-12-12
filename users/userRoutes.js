const userRoutes = require("express").Router();
const {
  userSignup,
  userLogin,
  userCheck,
  getAllUsers,
} = require("./userController.js");

userRoutes.get("/", userCheck);
userRoutes.post("/signup", userSignup);
userRoutes.post("/login", userLogin);
userRoutes.get("/get-all-users", getAllUsers);

userRoutes.get("/*", (req, res) => {
  res.status(404).json({ message: "Page not found" });
});

module.exports = userRoutes;
