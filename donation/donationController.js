const { DonationModel } = require("./donationModel.js");
const DonationRequetModel = require("../donationRequests/donationRequestModel.js")
const createDonation = async (req, res) => {
  try {
    const { orphanageId, requestId, donatedAmount } = req.body;
    if ((!orphanageId, !requestId, !donatedAmount)) {
      return res.status(401).json({ message: "All fields are required." });
    }

    const donation = await new DonationModel({
      orphanageId,
      requestId,
      donatedAmount,  
      donatedUserId: req.body?.donatedUserId || null,
      donatedOrganizationId: req.body?.donatedOrganizationId || null,
      accountHolderName: req.body?.accountHolderName,
      cardNumber: req.body?.cardNumber,
    });

    await donation.save();
    return res.status(201).json({
      message: "Donation created successfully",
      data: donation,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const allDonations = async (req, res) => {
  try {
    const donations = await DonationModel.find({})
      .populate("orphanageId")
      .populate("requestId")
      .populate("donatedUserId")
      .populate("donatedOrganizationId");
    return res.status(200).json({ message: "All Donations", data: donations });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
};
const donationsDoneByUser = async (req, res) => {
  try {
    const donations = await DonationModel.find({
      donatedUserId: { $ne: null },
    })
      .populate("orphanageId")
      .populate("requestId")
      .populate("donatedUserId");
    return res
      .status(200)
      .json({ message: "All donations done by users", data: donations });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
const donationsDoneByOrg = async (req, res) => {
  try {
    const donations = await DonationModel.find({
      donatedOrganizationId: { $ne: null },
    })
      .populate("orphanageId")
      .populate("requestId")
      .populate("donatedOrganizationId");
    return res.status(200).json({
      message: "All donations done by organaizations",
      data: donations,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// single user donations
const allDonationsByASingleUser = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(401).json({ message: "Id is required." });
    }
    if (!isValidObjectId(id)) {
      return res.status(404).json({ message: "Id is not valid." });
    }
    const donations = await DonationModel.find({ donatedUserId: id })
      .populate("orphanageId")
      .populate("requestId")
      .populate("donatedUserId");
    if (!donations) {
      return res.status(404).json({ message: "Donation not found." });
    }
    return res.status(200).json({ message: "All Donations", data: donations });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error });
  }
};

// all donations done by a single organization
const allDonationsByASingleOrg = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(401).json({ message: "Id is required." });
    }
    if (!isValidObjectId(id)) {
      return res.status(404).json({ message: "Id is not valid." });
    }
    const donations = await DonationModel.find({ donatedOrganizationId: id })
      .populate("orphanageId")
      .populate("requestId")
      .populate("donatedOrganizationId");
    if (!donations) {
      return res.status(404).json({ message: "Donation not found." });
    }
    return res.status(200).json({ message: "All Donations", data: donations });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error });
  }
};
// all donations recieved to a single orphanage
const donationsToASingleOrphanage = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(401).json({ message: "Id is required." });
    }
    if (!isValidObjectId(id)) {
      return res.status(404).json({ message: "Id is not valid." });
    }
    const donations = await DonationModel.find({ orphanageId: id })
      .populate("orphanageId")
      .populate("requestId")
      .populate("donatedOrganizationId")
      .populate("donatedUserId");
    if (!donations) {
      return res.status(404).json({ message: "Donation not found." });
    }
    return res.status(200).json({ message: "All Donations", data: donations });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error });
  }
};

const isValidObjectId = (id) => {
  const ObjectId = require("mongoose").Types.ObjectId;
  const isValid = ObjectId.isValid(id);

  if (!isValid) {
    return false;
  }
  // check if converting id back to a string results in same value
  const isStringEqual = new ObjectId(id).toString() === id;
  return isValid && isStringEqual;
};

module.exports = {
  createDonation,
  donationsDoneByUser,
  donationsDoneByOrg,
  allDonations,
  allDonationsByASingleOrg,
  allDonationsByASingleUser,
  donationsToASingleOrphanage,
};
