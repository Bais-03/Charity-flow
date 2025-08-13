import 'dotenv/config';
import express from "express"
import userRoutes from './routes/userRoutes.js'
import donationRoutes from './routes/donationRoutes.js'
import ngoRoutes from './routes/ngoRoutes.js'
import adminRoutes from './routes/authRoutes.js'
import { connectDB } from "./config/db.js"
import dotenv from "dotenv"
import cors from "cors"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

connectDB()

// 🔥 Middleware
app.use(cors({
  origin: 'http://127.0.0.1:5500',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve static uploads folder
app.use('/uploads', express.static('uploads'));
app.use(express.static('public'));
// ✅ Serve static frontend files

// 🛣️ Routes
app.use('/api/users', userRoutes)
app.use('/api/donations', donationRoutes)
app.use('/api/ngos', ngoRoutes)
app.use('/api/admin', adminRoutes)

app.get("/", (req, res) => {
  res.send("Backend is running...");
})

app.listen(PORT, () => {
  console.log("Server started at port:", PORT)
})


// mongodb+srv://baisrenukaa:tqw0vEdBAD6R3HS5@cluster0.h9jnzjx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
