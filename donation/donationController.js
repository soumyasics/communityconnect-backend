const { DonationModel } = require("./donationModel.js");
const DonationRequetModel = require("../donationRequests/donationRequestModel.js");
const OrphanageModel = require("../orphanages/orphanageModel.js");
const UserModel = require("../users/userModel.js");
const OrganizationModel = require("../organizations/organizationModel.js");

const createDonation = async (req, res) => {
  try {
    const { orphanageId, requestId, donatedAmount } = req.body;
    if ((!orphanageId, !requestId, !donatedAmount)) {
      return res.status(401).json({ message: "All fields are required." });
    }

    let convertedDonatedAmt = Number(donatedAmount);
    if (isNaN(convertedDonatedAmt)) {
      return res
        .status(401)
        .json({ message: "Donated amount is not a number" });
    }

    const donatedUserId = req.body?.donatedUserId || null;
    const donatedOrganizationId = req.body?.donatedOrganizationId || null;
    if (donatedUserId && donatedOrganizationId) {
      return res
        .status(401)
        .json({ message: "Donor can't be both user and organization." });
    }
    if (!donatedUserId && !donatedOrganizationId) {
      return res
        .status(401)
        .json({ message: "Donor neither user nor organization." });
    }

    if (!isValidObjectId(orphanageId)) {
      return res.status(404).json({ message: "Orphanage not found." });
    }
    if (!isValidObjectId(requestId)) {
      return res.status(404).json({ message: "Request not found." });
    }
    if (donatedUserId) {
      const user = await UserModel.findById(donatedUserId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
    }

    if (donatedOrganizationId) {
      const org = await OrganizationModel.findById(donatedOrganizationId);
      if (!org) {
        return res.status(404).json({ message: "Organization not found." });
      }
    }

    const donationRequest = await DonationRequetModel.findById(requestId);
    if (!donationRequest) {
      return res.status(404).json({ message: "Request not found." });
    }

    if (donationRequest.status === "fulfilled") {
      return res
        .status(400)
        .json({ message: "This Donation request is already fullfilled." });
    }

    const targetAmt = Number(donationRequest.targetAmount);
    let collectedAmt = Number(donationRequest.totallyCollectedAmount);
    const requiredAmt = targetAmt - collectedAmt;

    if (isNaN(requiredAmt)) {
      return res
        .status(400)
        .json({ message: "Target amount or collectedAmt is not a number." });
    }

    if (convertedDonatedAmt > requiredAmt) {
      return res.status(400).json({
        message: `Donated amount can't be greater than required amount.`,
      });
    }



    collectedAmt += convertedDonatedAmt;
    donationRequest.totallyCollectedAmount = collectedAmt;

    if (donatedUserId) {
      const userDetails = await UserModel.findById(donatedUserId);

      const userDataObj = {
        donorId: donatedUserId,
        donatedAmount: convertedDonatedAmt,
        donorName: userDetails?.firstName,
        donorType: "user",
      };

      donationRequest.donorsList.push(userDataObj);
    }

    if (donatedOrganizationId) {
      const orgDetails = await OrganizationModel.findById(
        donatedOrganizationId
      );
      const orgDataObj = {
        donorId: donatedOrganizationId,
        donatedAmount: convertedDonatedAmt,
        donorName: orgDetails?.name,
        donorType: "organization",
      };
      donationRequest.donorsList.push(orgDataObj);
    }

    if (donationRequest.totallyCollectedAmount >= targetAmt) {
      donationRequest.status = "fulfilled";
    }
    await donationRequest.save();

    const orphanage = await OrphanageModel.findById(orphanageId);
    if (!orphanage) {
      return res.status(404).json({ message: "Orphanage not found." });
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

    // add the donated amount on the user or organization
    if (donatedUserId) {
      await UserModel.findByIdAndUpdate(donatedUserId, {
        $inc: { totalDonatedAmt: convertedDonatedAmt }
      })
    }
    if (donatedOrganizationId) {
      await OrganizationModel.findByIdAndUpdate(donatedOrganizationId, {
        $inc: {totalDonatedAmt: convertedDonatedAmt}
      })
    }
    
    orphanage.totalReceivedAmt += convertedDonatedAmt;
    await orphanage.save();

    return res.status(201).json({
      message: "Donation created successfully",
      data: donation,
      donationRequest
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
