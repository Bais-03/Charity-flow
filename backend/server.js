import express from "express"
import userRoutes from './routes/userRoutes.js'
import donationRoutes from './routes/donationRoutes.js'
import ngoRoutes from './routes/ngoRoutes.js'
import { connectDB } from "./config/db.js"
import dotenv from "dotenv"

dotenv.config()

const app = express()

const PORT = process.env.PORT || 5001

connectDB()

// 🔥 Middleware to parse JSON from requests
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes)
app.use('/api/donations', donationRoutes)
app.use('/api/ngos', ngoRoutes)


app.listen(PORT, () => {
    console.log("Server started at port:", PORT)
})

app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// mongodb+srv://baisrenukaa:tqw0vEdBAD6R3HS5@cluster0.h9jnzjx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0