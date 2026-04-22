const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(cors());

// 🔗 MongoDB connection
mongoose.connect("mongodb+srv://VT-2004:VT6360681710@chatapp.azpswvj.mongodb.net/productivity?appName=chatapp")
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

app.listen(5000, () => console.log("Server running on port 5000"));