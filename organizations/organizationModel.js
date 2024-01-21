const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: "String",
      default: null,
    },
    ownerName: {
      type: "String",
      default: null,
    },
    email: {
      type: "String",
      required: true,
      unique: true,
    },
    password: {
      type: "String",
      required: true,
    },
    address: {
      type: "String",
      default: null,
    },
    state: {
      type: "String",
      default: null,
    },
    pincode: {
      type: "String",
      default: null,
    },
    phoneNumber: {
      type: "String",
      default: null,
    },
    img: {
      type: Object,
      default: null,
    },
    totalDonatedAmt: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
  }
);

const OrganizationModel = mongoose.model("Organization", organizationSchema);
module.exports = OrganizationModel;
