const UserModel = require("./userModel.js");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const { isValidObjectId } = require("../utils/validObjectId.js");

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

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await new UserModel({
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      password: hashedPassword,
      gender: req?.body?.gender,
      age: req?.body?.age,
      street: req?.body?.street,
      city: req?.body?.city,
      state: req?.body?.state,
      pincode: req?.body?.pincode,
      phoneNumber: req?.body?.phoneNumber,
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
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "Email or Password is incorrect" });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordMatch) {
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
const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(401).json({ message: "Id is required" });
    }
    if (!isValidObjectId(id)) {
      return res.status(401).json({ message: "Id is not valid" });
    }
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User found", data: user });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const editUserById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(401).json({ message: "Id is required" });
    }
    if (!isValidObjectId(id)) {
      return res.status(401).json({ message: "Id is not valid" });
    }
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const updatedUser = await UserModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json({ message: "User updated", data: updatedUser });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
}

module.exports = {
  userCheck,
  userSignup,
  userLogin,
  getAllUsers,
  getUserById,
  editUserById
};
