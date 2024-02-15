const { CampModel } = require("./campModel.js");
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

const createCamp = async (req, res) => {
  try {
    const { campName, campPlace, campDate, campCapacity } = req.body;
    if (!campName || !campPlace || !campDate || !campCapacity) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const camp = await new CampModel({
      campName,
      campPlace,
      ownerId: req.body?.ownerId || null,
      campDate,
      campCapacity,
      isRegistrationCompleted: false,
      campRegistrations: [],
    });

    await camp.save();
    return res.status(200).json({ message: "Camp Created", data: camp });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error });
  }
};

const getAllCamps = async (req, res) => {
  const camps = await CampModel.find().populate("ownerId");
  return res.status(200).json({ message: "All Camps", data: camps });
};

const getCampById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Id is required" });
  }
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Id is not valid" });
  }
  const camp = await CampModel.findById(id).populate("ownerId");
  if (!camp) {
    return res.status(404).json({ message: "Camp not found" });
  }
  return res.status(200).json({ message: "Camp found", data: camp });
};

const getCampsByOwnerId = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Id is required" });
  }
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Id is not valid" });
  }
  const camps = await CampModel.find({ ownerId: id }).populate("ownerId");
  if (!camps) {
    return res.status(404).json({ message: "Camps not found" });
  }
  return res.status(200).json({ message: "Camps found", data: camps });
};

const participate = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Camp Id is required" });
    }
    if (!userId) {
      return res.status(400).json({ message: "User Id is required" });
    }
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Id is not valid" });
    }
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: "User Id is not valid" });
    }

    const camp = await CampModel.findById(id).populate("ownerId");
    if (!camp) {
      return res.status(404).json({ message: "Camp not found" });
    }

    if (camp.campRegistrations.includes(userId)) {
      return res
        .status(400)
        .json({ message: "Already registered in this camp" });
    }

    if (camp.campCapacity <= camp.campRegistrations.length) {
      return res.status(400).json({ message: "Camp is full" });
    }

    camp.campRegistrations.push(req.body.userId);
    await camp.save();

    return res.status(200).json({ message: "Participated", data: camp });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
};

module.exports = {
  createCamp,
  getCampById,
  getAllCamps,
  getCampsByOwnerId,
  participate,
};
