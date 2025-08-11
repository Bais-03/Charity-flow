import NGO from "../models/NGO.js"
import Donation from "../models/Donation.js"
import bcrypt from "bcryptjs"



export const registerNGO = async (req, res) => {
  const { name, email, password, address, phone } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" })
  }

  try {
    const existingNGO = await NGO.findOne({ email })
    if (existingNGO) {
      return res.status(400).json({ message: "NGO with this email already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newNGO = new NGO({
      name,
      email,
      password: hashedPassword,
      address,
      phone,
      requestHistory: []
    })

    await newNGO.save()
    res.status(201).json({ message: "NGO registered successfully", ngo: newNGO })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Login NGO only (no self-registration)
export const loginNGO = async (req, res) => {
  const { email, password } = req.body

  try {
    const ngo = await NGO.findOne({ email })
    if (!ngo) return res.status(404).json({ message: "NGO not found" })

    const isMatch = await bcrypt.compare(password, ngo.password)
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" })

    res.json({ message: "Login successful", ngoId: ngo._id })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// NGO requests item
export const requestItem = async (req, res) => {
  const { ngoId, itemType, itemName, quantity } = req.body;

  try {
    const ngo = await NGO.findById(ngoId);
    if (!ngo) return res.status(404).json({ message: "NGO not found" });

    ngo.requestHistory.push({
      itemType,
      itemName,
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
export const getNGORequests = async (req, res) => {
  const { id } = req.params

  try {
    const ngo = await NGO.findById(id)
    if (!ngo) return res.status(404).json({ message: "NGO not found" })

    res.json(ngo.requestHistory)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// NGO confirms item received
export const confirmReceived = async (req, res) => {
  const { ngoId, donationId } = req.params

  try {
    const ngo = await NGO.findById(ngoId)
    if (!ngo) return res.status(404).json({ message: "NGO not found" })

    const request = ngo.requestHistory.find(
      (r) => r.itemType === donationId && r.status === "Requested"
    )

    if (request) {
      request.status = "Received"
      await ngo.save()
    }

    res.json({ message: "Item marked as received" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


// Get all open NGO needs (for admin)
export const getAllNGONeeds = async (req, res) => {
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
export const getPreviousDonations = async (req, res) => {
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
