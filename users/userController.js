const UserModel = require("./userModel.js");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const userCheck = async (req, res) => {
  try {
    return res.status(200).send({ message: "User Route working" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const userSignup = async (req, res) => {
  console.log("rew", req.file);
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

    const newUser = await new UserModel({
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      password: req?.body?.password,
      gender: req?.body?.gender,
      age: req?.body?.age,
      street: req?.body?.street,
      city: req?.body?.city,
      state: req?.body?.state,
      pincode: req?.body?.pincode,
      contact: req?.body?.contact,
      nationality: req?.body?.nationality,
      img: req?.file,
    });
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
  console.log("re", req.body);
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

    const token = jwt.sign(
      {
        user: existingUser,
      },
      "JWT_SECRET_KEY"
    );

    return res.status(200).json({
      message: "User Successfully Logged in",
      data: existingUser,
      token,
    });
  } catch (error) {
    console.log("error on user login", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    return res.status(200).json({ message: "Get all users.", data: users });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
module.exports = { userCheck, userSignup, userLogin, getAllUsers };
