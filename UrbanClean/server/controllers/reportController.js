const Report = require("../models/Report");

// @desc    Get all reports (Staff Only)
// @route   GET /api/reports
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("citizen", "email")
      .sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Get reports for logged-in citizen
// @route   GET /api/reports/myreports
exports.getMyReports = async (req, res) => {
  try {
    // req.user.id comes from the 'protect' middleware
    const reports = await Report.find({ citizen: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Create a new report (Logged-in User)
// @route   POST /api/reports
exports.createReport = async (req, res) => {
  try {
    const { category, address, description, latitude, longitude } = req.body;

    const imageUrl = req.file
      ? `${process.env.BASE_URL}/uploads/${req.file.filename}`
      : null;

    const newReport = new Report({
      category,
      address,
      description,
      imageUrl,
      latitude, // <-- ADDED
      longitude, // <-- ADDED
      citizen: req.user.id, // Link report to the logged-in user
    });

    const savedReport = await newReport.save();
    res.status(201).json(savedReport);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating report", error: error.message });
  }
};

// @desc    Update a report's status (Staff Only)
// @route   PUT /api/reports/:id
exports.updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    let report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.status = status;
    await report.save();

    // Repopulate citizen info after saving
    report = await Report.findById(report._id).populate("citizen", "email");

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
