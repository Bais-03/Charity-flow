import Donation from "../models/Donation.js";
import NGO from "../models/NGO.js";
import User from "../models/User.js";
import sendEmail from "../utils/emailSender.js";

// This function allows a user to create a new donation
export const createDonation = async (req, res) => {
  const { userId, itemName, itemType, quantity, pickupLocation } = req.body;
  const photo = req.file?.path;

  try {
    const donation = await Donation.create({
      userId,
      itemName,
      itemType,
      quantity,
      pickupLocation,
      photo,
      status: "Pending",
    });

    res.status(201).json({ message: "Donation submitted", donation });
  } catch (error) {
    console.error("Donation creation error:", error);
    res.status(500).json({ error: error.message });
  }
};

// This function gets all donations (Admin)
export const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find().populate("userId");
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// This function gets a user's donations
export const getUserDonations = async (req, res) => {
  const { userId } = req.params;
  try {
    const donations = await Donation.find({ userId });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// This function allows an Admin to update a donation's status (Accept/Reject)
export const updateDonationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["Accepted", "Rejected", "Fulfilled", "Matched", "Allocated"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try { 
    const donation = await Donation.findByIdAndUpdate(id, { status }, { new: true });
    res.json({ message: `Donation ${status}`, donation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// This function tracks a donation by its ID.
export const trackDonationById = async (req, res) => {
  const { id } = req.params;
  try {
    const donation = await Donation.findById(id).populate("userId");
    if (!donation) return res.status(404).json({ message: "Donation not found" });
    res.json(donation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// This function matches a donation to an NGO request
export const matchDonationToNGORequest = async (req, res) => {
  const { id } = req.params; // donationId
  const { ngoId, requestIndex } = req.body;

  try {
    const donation = await Donation.findById(id);
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    if (donation.status !== "Accepted") {
      return res.status(400).json({
        message: "Donation must be in 'Accepted' status to be matched"
      });
    }

    const ngo = await NGO.findById(ngoId);
    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }

    const request = ngo.requestHistory[requestIndex];
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (donation.itemType.toLowerCase() !== request.itemType.toLowerCase()) {
      return res.status(400).json({
        message: "Item types don't match between donation and request"
      });
    }

    if (donation.quantity < request.quantity) {
      return res.status(400).json({
        message: "Donation quantity is less than requested amount"
      });
    }

    donation.status = "Matched";
    donation.matchedNGO = {
      ngoId: ngo._id,
      ngoName: ngo.name,
      requestIndex: requestIndex,
      itemName: request.itemName,
      itemType: request.itemType,
      requestedQuantity: request.quantity
    };

    request.status = "Fulfilled";
    request.fulfilledBy = {
      donationId: donation._id,
      donorId: donation.userId,
      fulfilledAt: new Date()
    };

    await Promise.all([donation.save(), ngo.save()]);

    res.json({
      message: "Donation successfully matched to NGO request",
      donation,
      ngoRequest: request
    });

  } catch (error) {
    console.error("Matching error:", error);
    res.status(500).json({
      message: "Failed to match donation",
      error: error.message
    });
  }
};