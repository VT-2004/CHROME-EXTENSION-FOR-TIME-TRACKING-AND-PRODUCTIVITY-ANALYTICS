const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(cors());

// 🔗 MongoDB connection (FIXED)
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("DB Error:", err));

// 🧠 Schema
const activitySchema = new mongoose.Schema({
    website: String,
    timeSpent: Number,
    category: String,
    date: {
        type: Date,
        default: Date.now
    }
});

const Activity = mongoose.model("Activity", activitySchema);

// 📥 Save activity
app.post("/api/activity", async (req, res) => {
    try {
        console.log("Incoming data:", req.body);

        const newActivity = new Activity(req.body);
        await newActivity.save();

        res.status(200).json({ message: "Saved successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to save data" });
    }
});

// 📊 Weekly data
app.get("/api/weekly", async (req, res) => {
    try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const data = await Activity.find({
            date: { $gte: oneWeekAgo }
        });

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

// 🏠 Root route
app.get("/", (req, res) => {
    res.send("Productivity Tracker Backend Running");
});

// 🔥 IMPORTANT FIX FOR RENDER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Server running on port", PORT));