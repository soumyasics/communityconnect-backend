const { Schema, model } = require("mongoose");
const donationSchema = Schema(
  {
    orphanageId: {
      type: Schema.Types.ObjectId,
      ref: "Orphanage",
      required: true,
    },
    requestId: {
      type: Schema.Types.ObjectId,
      ref: "DonationRequest",
      required: true,
    },
    donatedAmount: {
      type: String,
      required: true,
    },
    donatedUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    donatedOrganizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      default: null,
    },

    accountHolderName: {
      type: String,
      default: null,
    },
    cardNumber: {
      type: String,
      default: null,
    },
    modeOfPayment: {
      type: String,
      default: "Online",
    },
  },
  {
    timestamps: true,
  }
);

const DonationModel = model("Donation", donationSchema);
module.exports = { DonationModel };
