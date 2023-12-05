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

    const newUser = await new OrganizationModel(req.body);
    await newUser.save();
    return res
      .status(201)
      .json({ message: "Organization successfully registered", data: newUser });
  } catch (error) {
    console.log("error on orphanage signup", error);
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
      message: "Orphanage Successfully Logged in",
      data: existingOrganization,
    });
  } catch (error) {
    console.log("error on orphanage login", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
module.exports = { organizationCheck, organizationSignup, organizationLogin };
