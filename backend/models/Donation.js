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
    enum: ["Clothing", "Furniture", "Electronics", "Books", "Toys", "Household", "Other"],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  photo: {
    type: String, // path or URL to the uploaded image
    required: true,
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
