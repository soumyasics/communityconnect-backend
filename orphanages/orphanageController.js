const OrphanageModel = require("./orphanageModel.js");
const bcrypt = require("bcrypt");

const orphanageCheck = async (req, res) => {
  try {
    return res.status(200).json({ message: "Orphanage Route working" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
const orphanageSignup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const oldUser = await OrphanageModel.findOne({ email });
    if (oldUser) {
      return res
        .status(400)
        .json({ message: "Email already taken try a different email." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newOrphanage = await new OrphanageModel({
      name: req?.body?.name,
      yearOfEstablishment: req?.body?.yearOfEstablishment,
      email: req?.body?.email,
      password: hashedPassword,
      purpose: req?.body?.purpose,
      address: req?.body?.address,
      city: req?.body?.city,
      state: req?.body?.state,
      pincode: req?.body?.pincode,
      phoneNumber: req?.body?.phoneNumber,
      description: req?.body?.description,
      img: req?.file,
    });
    await newOrphanage.save();

    return res.status(201).json({
      message: "Orphanage successfully registered",
      data: newOrphanage,
    });
  } catch (error) {
    console.log("error on orphanage signup", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const orphanageLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingOrphanage = await OrphanageModel.findOne({ email });
    if (!existingOrphanage) {
      return res
        .status(400)
        .json({ message: "Email or Password is incorrect" });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      existingOrphanage.password
    );

    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ message: "Email or Password is incorrect" });
    }

    return res.status(200).json({
      message: "Orphanage Successfully Logged in",
      data: existingOrphanage,
    });
  } catch (error) {
    console.log("error on orphanage login", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const getAllOrphanages = async (req, res) => {
  try {
    const orphanages = await OrphanageModel.find();
    return res
      .status(200)
      .json({ message: "Get all orphanages", data: orphanages });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const getOrphanageById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Id is required" });
    }
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Id is not valid" });
    }
    const orphanage = await OrphanageModel.findById(id);
    if (!orphanage) {
      return res.status(404).json({ message: "Orphanage not found" });
    }
    return res
      .status(200)
      .json({ message: "Orphanage found", data: orphanage });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

const editOrpById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Id is required" });
    }
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Id is not valid" });
    }
    const orphanage = await OrphanageModel.findById(id);
    if (!orphanage) {
      return res.status(404).json({ message: "Orphanage not found" });
    }
   
    let updated = await OrphanageModel.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json({ message: "Orphanage updated" , data: updated});
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
}

// Checking if id is valid
const isValidObjectId = (id) => {
  const ObjectId = require("mongoose").Types.ObjectId;
  const isValid = ObjectId.isValid(id);

  // check if converting id back to a string results in same value
  const isStringEqual = new ObjectId(id).toString() === id;
  return isValid && isStringEqual;
};

module.exports = {
  orphanageCheck,
  orphanageSignup,
  orphanageLogin,
  getAllOrphanages,
  getOrphanageById,editOrpById
};
