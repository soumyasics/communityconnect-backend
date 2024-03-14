const OrganizationModel = require("./organizationModel.js");
const bcrypt = require("bcrypt");
const { isValidObjectId } = require("../utils/validObjectId.js");

const organizationCheck = async (req, res) => {
  try {
    return res.status(200).json({ message: "organization Route working" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
const organizationSignup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const oldUser = await OrganizationModel.findOne({ email });
    if (oldUser) {
      return res
        .status(400)
        .json({ message: "Email already taken. Try a different one." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newOrg = await new OrganizationModel({
      name: req.body?.name,
      ownerName: req.body?.ownerName,
      email: req.body?.email,
      password: hashedPassword,
      address: req.body?.address,
      state: req.body?.state,
      pincode: req.body?.pincode,
      phoneNumber: req.body?.phoneNumber,
      img: req?.file,
    });
    await newOrg.save();
    return res
      .status(201)
      .json({ message: "Organization successfully registered", data: newOrg });
  } catch (error) {
    console.log("error on organization signup", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const organizationLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingOrganization = await OrganizationModel.findOne({ email });
    if (!existingOrganization) {
      return res
        .status(400)
        .json({ message: "Email or Password is incorrect" });
    }

    const isMatch = await bcrypt.compare(
      password,
      existingOrganization.password
    );

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Email or Password is incorrect" });
    }

    return res.status(200).json({
      message: "Organization Successfully Logged in",
      data: existingOrganization,
    });
  } catch (error) {
    console.log("error on Organization login", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const getAllOrganizations = async (req, res) => {
  try {
    const organizations = await OrganizationModel.find();
    return res
      .status(200)
      .json({ message: "Get all organizations", data: organizations });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const getOrgById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(401).json({ message: "Id is required" });
    }
    if (!isValidObjectId(id)) {
      return res.status(401).json({ message: "Id is not valid" });
    }
    const user = await OrganizationModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Org not found" });
    }
    return res.status(200).json({ message: "Org found", data: user });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const editOrgById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(401).json({ message: "Id is required" });
    }
    if (!isValidObjectId(id)) {
      return res.status(401).json({ message: "Id is not valid" });
    }


    const user = await OrganizationModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Organization not found" });
    }
    const updatedUser = await OrganizationModel.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );
    return res
      .status(200)
      .json({ message: "Organization updated", data: updatedUser });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  organizationCheck,
  organizationSignup,
  organizationLogin,
  getAllOrganizations,
  getOrgById,
  editOrgById,
};
