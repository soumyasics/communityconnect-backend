const OrphanageModel = require("./orphanageModel.js");

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

    const newUser = await new OrphanageModel(req.body);
    await newUser.save();
    return res
      .status(201)
      .json({ message: "Orphanage successfully registered", data: newUser });
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

    if (existingOrphanage.password !== password) {
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
module.exports = { orphanageCheck, orphanageSignup, orphanageLogin };
