import Donation from "../models/Donation.js"

// Create donation
export const createDonation = async (req, res) => {
  const { userId, itemName, itemType, pickupLocation } = req.body;
  const image = req.file?.path;

  try {
    const donation = await Donation.create({
      userId,
      itemName,
      itemType,
      pickupLocation,
      image,
    });
    res.status(201).json({ message: "Donation submitted", donation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Get all donations (Admin)
export const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find().populate("userId");
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get a user's donations
export const getUserDonations = async (req, res) => {
  const { userId } = req.params

  try {
    const donations = await Donation.find({ user: userId })
    res.json(donations)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Admin updates status (Accept/Reject)
export const updateDonationStatus = async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  if (!["Accepted", "Rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" })
  }

  try {
    const donation = await Donation.findByIdAndUpdate(id, { status }, { new: true })
    res.json({ message: `Donation ${status}`, donation })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Track donation by ID
export const trackDonationById = async (req, res) => {
  const { id } = req.params

  try {
    const donation = await Donation.findById(id).populate("userId")
    if (!donation) return res.status(404).json({ message: "Donation not found" })

    res.json(donation)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
