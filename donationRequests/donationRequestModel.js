const mongoose = require("mongoose");

const getLastDayOfMonth = () => {
  const today = new Date();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return lastDayOfMonth;
};

const donationRequestSchema = new mongoose.Schema(
  {
    orphanageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Orphanage",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    targetAmount: {
      type: Number,
      required: true,
    },
    bankAcNumber: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      default: getLastDayOfMonth,
    },
    category: {
      type: String,
      default: "Orphanage expenses",
    },
    urgencyLevel: {
      type: String,
      enum: ["low", "moderate", "high", "critical"],
    },
    status: {
      type: String,
      enum: ["pending", "fulfilled"],
      default: "pending",
    },
    description: {
      type: String,
      default: "Orphanage donation request",
    },
    isAdminApproved: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    totallyCollectedAmount: {
      type: Number,
      default: 0,
    },
    donorsList: {
      type: [
        {
          donorId: mongoose.Schema.Types.Mixed,
          donatedAmount: Number,
          donorName: String,
          donorType: String
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);
const DonationRequestModel = mongoose.model(
  "DonationRequest",
  donationRequestSchema
);
module.exports = DonationRequestModel;
