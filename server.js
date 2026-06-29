const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const dns = require("dns");

// Google DNS ব্যবহার করবে
dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files
app.use(express.static(__dirname));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:");
    console.error(err);
  });

// Routes
app.use("/api/auth", require("./authRoutes"));
app.use("/api/courses", require("./courseRoutes"));
app.use("/api/contact", require("./contactRoutes"));

// Home Route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server Running on http://localhost:${PORT}`);
});