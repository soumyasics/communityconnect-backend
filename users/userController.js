const UserModel = require("./userModel.js");

const userCheck = async (req, res) => {
  try {
    return res.status(200).send({ message: "User Route working" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
const userSignup = async (req, res) => {
  try {
    const { firstName, email, password } = req.body;

    if (!firstName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const oldUser = await UserModel.findOne({ email });
    if (oldUser) {
      return res
        .status(400)
        .json({ message: "Email already taken try a different email." });
    }

    const newUser = await new UserModel(req.body);
    await newUser.save();
    return res
      .status(201)
      .json({ message: "User successfully registered", data: newUser });
  } catch (error) {
    console.log("error on user signup", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "User doesn't exist" });
    }

    if (existingUser.password !== password) {
      return res
        .status(400)
        .json({ message: "Email or Password is incorrect" });
    }

    return res.status(200).json({
      message: "User Successfully Logged in",
      data: existingUser,
    });
  } catch (error) {
    console.log("error on user login", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
module.exports = { userCheck, userSignup, userLogin };
