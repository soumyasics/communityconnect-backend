const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    age: {
      type: Number,
      default: null,
      min: 0,
    },
    street: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    state: {
      type: String,
      default: null,
    },
    pincode: {
      type: String,
      default: null,
    },
    contact: {
      type: String,
      default: null,
    },
    nationality: {
      type: String,
      default: null,
    },
    img: {
      type: Object,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
