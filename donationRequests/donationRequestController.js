const OrphanageModel = require("../orphanages/orphanageModel.js");
const DonationRequestModel = require("./donationRequestModel.js");

const createDonationRequest = async (req, res) => {
  try {
    const { orphanageId, title, targetAmount, bankAcNumber } = req.body;

    if (!orphanageId || !title || !targetAmount || !bankAcNumber) {
      return res.status(401).json({ message: "All fields are required" });
    }

    const orphanage = await OrphanageModel.findById(orphanageId);
    if (!orphanage) {
      return res.status(404).json({ message: "Orphanage not found" });
    }
    let convertedAmount = Number(targetAmount);
    if (isNaN(convertedAmount)) {
      return res.status(401).json({ message: "Target amount is not a number" });
    }
    const newRequest = await new DonationRequestModel({
      orphanageId,
      title,
      targetAmount: convertedAmount,
      bankAcNumber,
      deadline: req.body?.deadline,
      category: req.body?.category,
      urgencyLevel: req.body?.urgencyLevel,
      description: req.body?.description,
      bankAcDetails: req.body?.bankAcDetails,
    });
    await newRequest.save();
    return res.status(201).json({
      message: "Donation requested created successfully",
      data: newRequest,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

const getAllRequests = async (req, res) => {
  try {
    const requests = await DonationRequestModel.find().populate("orphanageId");
    return res
      .status(200)
      .json({ message: "All donation requests", data: requests });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error });
  }
};

const getAllRequestsByOrphanageId = async (req, res) => {
  try {
    const orphanageId = req?.params?.id;
    if (!orphanageId) {
      return res.status(400).json({ message: "Orphanage id is required" });
    }

    if (!isValidObjectId(orphanageId)) {
      return res.status(400).json({ message: "Orphanage id is not valid" });
    }

    const getOrphanage = await OrphanageModel.findById(orphanageId);
    if (!getOrphanage) {
      return res.status(404).json({ message: "Orphanage not found" });
    }

    const getAllOrphanageRequests = await DonationRequestModel.find({
      orphanageId: orphanageId,
    });
    

    return res.status(200).json({
      message: "Get all orphanage requests by id",
      data: getAllOrphanageRequests,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

const getDonationRequestById = async (req, res) => {
  try {
    const id = req.params?.id;
    if (!id) {
      return res.status(400).json({ message: "Id is required." });
    }

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Id is not valid." });
    }
    const getRequest = await DonationRequestModel.findById(id).populate(
      "orphanageId"
    );

    if (!getRequest) {
      return res.status(400).json({ message: "Request not found." });
    }
    return res.status(200).json({
      message: "Get donation request by id",
      data: getRequest,
    });
  } catch (err) {
    return res.status(500).send({ message: "Server Error" });
  }
};

const approveReqById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({ message: "Id is required" });
    }
    if (!isValidObjectId(id)) {
      return res.status(400).send({ message: "Id is not valid" });
    }
    const getRequest = await DonationRequestModel.findById(id);
    if (!getRequest) {
      return res.status(404).send({ message: "Request not found" });
    }

    const result = await DonationRequestModel.updateOne(
      { _id: id },
      { $set: { isAdminApproved: "approved" } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    const updatedRequest = await DonationRequestModel.findById(id);
    return res
      .status(200)
      .json({ message: "Request approved successfully", data: updatedRequest });
  } catch (error) {
    return res.status(500).json({ message: "Server erorr" });
  }
};

const rejectReqById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({ message: "Id is required" });
    }
    if (!isValidObjectId(id)) {
      return res.status(400).send({ message: "Id is not valid" });
    }
    const getRequest = await DonationRequestModel.findById(id);
    if (!getRequest) {
      return res.status(404).send({ message: "Request not found" });
    }

    const result = await DonationRequestModel.updateOne(
      { _id: id },
      { $set: { isAdminApproved: "rejected" } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Request not found" });
    }

    const updatedRequest = await DonationRequestModel.findById(id);
    return res
      .status(200)
      .json({ message: "Request rejected successfully", data: updatedRequest });
  } catch (error) {
    return res.status(500).json({ message: "Server erorr" });
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
  createDonationRequest,
  getAllRequests,
  getAllRequestsByOrphanageId,
  getDonationRequestById,
  approveReqById,
  rejectReqById,
};
