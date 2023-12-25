const OrganizationModel = require("./organizationModel.js");

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

    const newOrg = await new OrganizationModel({
      name: req.body?.name,
      ownerName: req.body?.ownerName,
      email: req.body?.email,
      password: req.body?.password,
      address: req.body?.address,
      state: req.body?.state,
      pincode: req.body?.pincode,
      phoneNumber: req.body?.phoneNumber,
      img: req?.file,
    })
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

    if (existingOrganization.password !== password) {
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
module.exports = {
  organizationCheck,
  organizationSignup,
  organizationLogin,
  getAllOrganizations,
};
