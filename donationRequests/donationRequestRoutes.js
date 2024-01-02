const {
  createDonationRequest,
  getAllRequests,
  getAllRequestsByOrphanageId,
  getDonationRequestById,
} = require("./donationRequestController.js");

const donationRequestRoutes = require("express").Router();

donationRequestRoutes.get("/check", (req, res) => {
  return res.status(200).json({ message: "donation request working" });
});

donationRequestRoutes.post("/create-donation-request", createDonationRequest);
donationRequestRoutes.get("/get-all-requests", getAllRequests);
donationRequestRoutes.get(
  "/get-all-requests-by-orphanage-id/:id",
  getAllRequestsByOrphanageId
);
donationRequestRoutes.get("/get-donation-request/:id", getDonationRequestById);

module.exports = donationRequestRoutes;
