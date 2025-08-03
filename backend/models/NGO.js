import mongoose from "mongoose"

const ngoSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  requestHistory: [
    {
      itemType: String,
      quantity: Number,
      status: {
        type: String,
        enum: ["Requested", "Fulfilled", "Rejected"],
        default: "Requested"
      }
    }
  ]
})

const NGO = mongoose.model("NGO", ngoSchema)
export default NGO
