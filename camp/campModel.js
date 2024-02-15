const { Schema, model } = require("mongoose");

const campSchema = new Schema(
  {
    campName: {
      type: String,
      required: true,
    },
    campDescription: {
      type: String,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      default: null,
    },
    campPlace: {
      type: String,
      required: true,
    },
    campDate: {
      type: String,
      required: true,
    },
    campCapacity: {
      type: Number,
      required: true,
    },
    isRegistrationCompleted: {
      type: Boolean,
      default: false,
    },
    campRegistrations: [],
  },
  {
    timestamps: true,
  }
);

const CampModel = model("Camp", campSchema);
module.exports = { CampModel };
