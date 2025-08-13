import Donation from "../models/Donation.js";
import NGO from "../models/NGO.js";
import User from "../models/User.js";
import sendEmail from "../utils/emailSender.js";  // Your NodeMailer wrapper

// Create a donation (Users)
export const createDonation = async (req, res) => {
  let { userId, itemName, itemType, quantity, pickupLocation } = req.body;
  const photo = req.file?.path;
  let warning = null;

  // Clean input
  itemType = itemType?.trim();
  itemName = itemName?.trim();

  try {
    // Check if any NGO currently requests this item
    const matchingNGO = await NGO.findOne({
      "requestHistory.itemType": itemType,
      "requestHistory.itemName": itemName,
      "requestHistory.status": "Requested",
    });

    if (!matchingNGO) {
      warning = "No NGO currently requested this item, but we have saved your donation.";
    }

    const donation = await Donation.create({
      userId,
      itemName,
      itemType,
      quantity,
      pickupLocation,
      photo,
      status: "Pending",
    });

    res.status(201).json({
      message: "Donation submitted successfully",
      warning,
      donation,
    });
  } catch (error) {
    console.error("Donation creation error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all donations (Admin)
export const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate("userId")
      .populate("matchedNGO.ngoId", "name")
      .sort({ createdAt: -1 }); // KEY CHANGE: Sort by createdAt in descending order
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a user's donations
export const getUserDonations = async (req, res) => {
  const { userId } = req.params;
  try {
    const donations = await Donation.find({ userId });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin updates donation status (Accept/Reject)
export const updateDonationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["Accepted", "Rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    // Update donation status and populate user for email
    const donation = await Donation.findByIdAndUpdate(id, { status }, { new: true }).populate("userId");

    if (!donation) return res.status(404).json({ message: "Donation not found" });

    // Send email notification to donor on acceptance
    if (status === "Accepted" && donation.userId?.email) {
      await sendEmail(
        donation.userId.email,
        "Your Donation Has Been Accepted",
        `Hello,

Your donation of ${donation.quantity} ${donation.itemType} (${donation.itemName}) has been accepted. Thank you for your generosity!

We will notify you once it is allocated to an NGO.

Best regards,
Goods for Good Team`
      );
    }

    res.json({ message: `Donation ${status}`, donation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Track donation by ID
export const trackDonationById = async (req, res) => {
  const { id } = req.params;
  try {
    // KEY CHANGE: Populate userId and the nested ngoId inside matchedNGO
    const donation = await Donation.findById(id)
      .populate("userId", "name email") // Populate userId to get name and email
      .populate("matchedNGO.ngoId", "name"); // Populate ngoId inside matchedNGO for its name
    
    if (!donation) return res.status(404).json({ message: "Donation not found" });
    res.json(donation);
  } catch (error) {
    console.error("Tracking error:", error); // Added console.error for better debugging
    res.status(500).json({ error: error.message });
  }
};

// Match a donation to an NGO request (Admin)
export const matchDonationToNGORequest = async (req, res) => {
  const { id } = req.params; // donationId
  const { ngoId, requestIndex } = req.body;

  try {
    const donation = await Donation.findById(id).populate("userId");
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    if (donation.status !== "Accepted") {
      return res.status(400).json({
        message: "Donation must be in 'Accepted' status to be matched",
      });
    }

    const ngo = await NGO.findById(ngoId);
    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }

    const request = ngo.requestHistory[requestIndex];
    if (!request) {
      donation.status = "Unmatched";
      await donation.save();
      return res.status(200).json({
        message: "No NGO request found for this donation. Marked as 'Unmatched'.",
        donation,
      });
    }

    if (donation.quantity < request.quantity) {
      return res.status(400).json({
        message: "Donation quantity is less than requested amount",
      });
    }

    // Update donation with matching info
    donation.status = "Matched";
    donation.matchedNGO = {
      ngoId: ngo._id,
      ngoName: ngo.name,
      requestIndex,
      itemName: request.itemName,
      itemType: request.itemType,
      requestedQuantity: request.quantity,
    };

    // Update NGO request status
    request.status = "Fulfilled";
    request.fulfilledBy = {
      donationId: donation._id,
      donorId: donation.userId,
      fulfilledAt: new Date(),
    };

    await Promise.all([donation.save(), ngo.save()]);

    // Send email to NGO about allocation
    if (ngo.email) {
      await sendEmail(
        ngo.email,
        "Your NGO Request Has Been Fulfilled",
        `Hello ${ngo.name},

Good news! Your request for ${request.quantity} ${request.itemType} (${request.itemName}) has been fulfilled by a generous donor.

Thank you for your work and dedication.

Best regards,
Goods for Good Team`
      );
    }

    // Send email to donor about allocation
    if (donation.userId?.email) {
      await sendEmail(
        donation.userId.email,
        "Your Donation Has Been Allocated to an NGO",
        `Hello,

Your donation of ${donation.quantity} ${donation.itemType} (${donation.itemName}) has been allocated to the NGO "${ngo.name}".

Thank you for helping those in need!

Best regards,
Goods for Good Team`
      );
    }

    res.json({
      message: "Donation successfully matched to NGO request",
      donation,
      ngoRequest: request,
    });
  } catch (error) {
    console.error("Matching error:", error);
    res.status(500).json({
      message: "Failed to match donation",
      error: error.message,
    });
  }
};
