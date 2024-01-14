const DonationModel = require("./donationModel.js");

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
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};
const getAllDonations = async (req, res) => {
  try {
    const donations = await DonationModel.find({});
    return res.status(200).json({ message: "All donations", data: donations });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
module.exports = { createDonation, getAllDonations };
