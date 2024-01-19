const donationRoutes = require("express").Router();
const {
  createDonation,
  donationsDoneByOrg,
  donationsDoneByUser,
  allDonations,
  allDonationsByASingleOrg,
  allDonationsByASingleUser,donationsToASingleOrphanage
} = require("./donationController.js");

donationRoutes.get("/check", (req, res) => {
  return res.status(200).json({ message: "donation route working" });
});

donationRoutes.post("/create", createDonation);
donationRoutes.get("/get-all-donations", allDonations);
donationRoutes.get("/donations-done-by-users", donationsDoneByUser);
donationRoutes.get("/donations-done-by-organizations", donationsDoneByOrg);
donationRoutes.get("/donations-done-by-single-user/:id", allDonationsByASingleUser);
donationRoutes.get("/donations-done-by-single-org/:id", allDonationsByASingleOrg);
donationRoutes.get("/donations-to-single-orphanage/:id", donationsToASingleOrphanage);

module.exports = donationRoutes;
