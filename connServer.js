//connServer.js

const express = require("express");
const app = express();

const mongoose = require("mongoose");

app.use(express.static("view"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/view/EventView.html");
});

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/EventDB");

const conn = mongoose.connection;
conn.on("connected", () => {
    console.log("connected to mongodb");
});

// Event schema
const EventSchema = mongoose.Schema({
    title: String,
    date: Date,
    location: String,
    remind: Boolean
});

const Eventsmodel = mongoose.model("Events", EventSchema);

// Get all events
app.get("/api/Events", (req, res) => {
    Eventsmodel.find().then((data) => {
        res.json(data);
    }).catch((err) => {
        res.status(500).json({ message: "Error fetching events", error: err });
    });
});

// Add a new event
app.post("/api/addEvents", async (req, res) => {
    const newEvent = new Eventsmodel({
        title: req.body.title,
        date: req.body.date,
        location: req.body.location,
        remind: req.body.remind
    });

    try {
        await newEvent.save();
        res.json({ message: 'Event added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error adding event", error: err });
    }
});

// Delete an event
app.delete("/api/deleteEvent/:_id", async (req, res) => {
    try {
        await Eventsmodel.findOneAndDelete({ _id: req.params._id });
        res.json({ message: "Event deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting event", error: err });
    }
});

// Edit an event
app.put("/api/editevent/:_id", async (req, res) => {
    const updateEvent = {
        title: req.body.title,
        date: req.body.date,
        location: req.body.location,
        remind: req.body.remind
    };

    try {
        const event = await Eventsmodel.findOneAndUpdate(
            { _id: req.params._id },
            updateEvent,
            { new: true }
        );
        res.json({ message: "Event updated successfully", event });
    } catch (err) {
        res.status(500).json({ message: "Error updating event", error: err });
    }
});

app.listen(2004, () => {
    console.log(`Server listening on port 2004`);
    console.log(`http://localhost:2004`);
});
