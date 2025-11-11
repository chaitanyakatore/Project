const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, "Please select a category"],
      enum: ["Illegal Dumping", "Missed Pickup", "Damaged Bin", "Other"],
    },
    address: {
      type: String,
      required: [true, "Please provide an address or location"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    imageUrl: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      default: "Submitted",
      enum: ["Submitted", "In Progress", "Resolved", "Rejected"],
    },
    // Link to the user who created the report
    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // --- NEW FIELDS FOR MAP ---
    latitude: {
      type: Number,
      required: false,
    },
    longitude: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Report", ReportSchema);
