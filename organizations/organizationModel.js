const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: "String",
      default: null,
    },
    yearOfEstablishment: {
      type: "String",
      default: null,
    },
    street: {
      type: "String",
      default: null,
    },
    city: {
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
    contact: {
      type: "String",
      default: null,
    },
    email: {
      type: "String",
      required: true,
      unique: true,
    },
    nationality: {
      type: "String",
      default: null,
    },
    description: {
      type: "String",
      default: null,
    },
    password: {
      type: "String",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const OrganizationModel = mongoose.model("Organization", organizationSchema);
module.exports = OrganizationModel;
