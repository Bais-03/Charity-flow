import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  itemType: {
    type: String,
    enum: ["Clothes", "Plastic", "Wood", "Electronics", "Others"],
    required: true,
  },
  image: {
    type: String, // path or URL to the uploaded image
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  pickupLocation: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("Donation", donationSchema);
