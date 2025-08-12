import NGO from "../models/NGO.js";
import Donation from "../models/Donation.js";
import bcrypt from "bcryptjs";
import sendEmail from "../utils/emailSender.js";
import User from "../models/User.js";

const getImpactMessage = (itemType) => {
  switch (itemType) {
    case 'Clothing':
      return "providing warmth and dignity to those in need";
    case 'Furniture':
      return "furnishing a home for a family in transition";
    case 'Electronics':
      return "providing access to educational resources";
    case 'Books':
      return "supporting children's education";
    case 'Toys':
      return "bringing joy to a child in need";
    default:
      return "providing much-needed support to the community";
  }
};

const registerNGO = async (req, res) => {
  const { name, email, password, address, phone } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  try {
    const existingNGO = await NGO.findOne({ email });
    if (existingNGO) {
      return res.status(400).json({ message: "NGO with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newNGO = new NGO({
      name,
      email,
      password: hashedPassword,
      address,
      phone,
      requestHistory: []
    });

    await newNGO.save();
    res.status(201).json({ message: "NGO registered successfully", ngo: newNGO });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login NGO only (no self-registration)
const loginNGO = async (req, res) => {
  const { email, password } = req.body;

  try {
    const ngo = await NGO.findOne({ email });
    if (!ngo) return res.status(404).json({ message: "NGO not found" });

    const isMatch = await bcrypt.compare(password, ngo.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    res.json({ message: "Login successful", ngoId: ngo._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// NGO requests item
const requestItem = async (req, res) => {
  const { ngoId, itemType, quantity } = req.body;

  try {
    const ngo = await NGO.findById(ngoId);
    if (!ngo) return res.status(404).json({ message: "NGO not found" });

    ngo.requestHistory.push({
      itemType,
      quantity,
      status: "Requested"
    });

    await ngo.save();
    res.status(201).json({ message: "Request submitted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// NGO sees all its requests
const getNGORequests = async (req, res) => {
  const { id } = req.params;

  try {
    const ngo = await NGO.findById(id);
    if (!ngo) return res.status(404).json({ message: "NGO not found" });

    res.json(ngo.requestHistory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// NGO confirms item received
const confirmReceived = async (req, res) => {
  const { ngoId, donationId } = req.params;

  try {
    const ngo = await NGO.findById(ngoId);
    if (!ngo) return res.status(404).json({ message: "NGO not found" });

    const request = ngo.requestHistory.find(
      (r) => r.itemType === donationId && r.status === "Requested"
    );

    if (request) {
      request.status = "Received";
      await ngo.save();
    }

    res.json({ message: "Item marked as received" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const allocateDonation = async (req, res) => {
  const { ngoId, donationId, donorEmail } = req.body;

  try {
    // 1. Find the donation and the NGO
    const donation = await Donation.findById(donationId);
    const ngo = await NGO.findById(ngoId);
    const donor = await User.findOne({ email: donorEmail });

    if (!donation || !ngo || !donor) {
      return res.status(404).json({ message: "Donation, NGO, or Donor not found" });
    }

    // 2. Perform the allocation logic (e.g., update donation status, link to NGO)
    donation.status = "Allocated";
    donation.allocatedToNgo = ngo._id;
    await donation.save();

    // 3. Send email to the Donor (with dynamic name and impact message)
    await sendEmail(
      donorEmail,
      `Your Donation Has Reached ${ngo.name}`,
      `Dear ${donor.name},\n${donation.itemType} has been successfully allocated to ${ngo.name} and will support ${getImpactMessage(donation.itemType)}.\nWe’re grateful for your trust in GoodsForGood.\n\n- The GoodsForGood Team`
    );

    // 4. Send email to the NGO (using the email from the database object)
    await sendEmail(
      ngo.email,
      "New Donation Allocated to Your NGO",
      `Hello ${ngo.name}, \nWe are excited to inform you that a new donation of ${donation.itemType} has been allocated to your organization, helping to fulfill one of your important requests!\nThank you for the incredible work you do.\n\n- The GoodsForGood Team`
    );

    res.json({ message: "Donation allocated and notifications sent", donation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all open NGO needs (for admin)
const getAllNGONeeds = async (req, res) => {
  try {
    const ngos = await NGO.find();
    const needs = [];
    ngos.forEach(ngo => {
      (ngo.requestHistory || []).forEach((req, idx) => {
        if (req.status === "Requested") {
          needs.push({
            ngoId: ngo._id,
            ngoName: ngo.name,
            requestIndex: idx,
            itemName: req.itemName,
            itemType: req.itemType,
            quantity: req.quantity,
            status: req.status
          });
        }
      });
    });
    res.json(needs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get all donations made to a specific NGO
const getPreviousDonations = async (req, res) => {
  const { id } = req.params;

  try {
    const donations = await Donation.find({ ngoId: id })
      .sort({ createdAt: -1 }); // Most recent first

    res.json(donations);
  } catch (error) {
    console.error("Error fetching previous donations:", error);
    res.status(500).json({ message: error.message });
  }
};

export {
  registerNGO,
  loginNGO,
  requestItem,
  getNGORequests,
  confirmReceived,
  allocateDonation,
  getAllNGONeeds,
  getPreviousDonations
};