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
    phoneNumber: {
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
    totalDonatedAmt: {
      type: Number,
      default: 0,
    },
    passwordResetOtp: {
      type: Number,
      default: null,
    },
    bloodDonation: {
      isSlotBookedOrDonated: {
        type: Boolean,
        default: false,
      },
      scheduledDate: {
        type: Date,
        default: null,
      },
      nextDonationDate: {
        type: Date,
        default: null,
      },
      bookedCampId: {
        type: String,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);
const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
