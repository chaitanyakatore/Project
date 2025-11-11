const express = require("express");
const router = express.Router();
const {
  getAllReports,
  getMyReports,
  createReport,
  updateReportStatus,
} = require("../controllers/reportController");
const upload = require("../middleware/upload");
const { protect, authorize } = require("../middleware/authMiddleware");

// --- Public / Citizen Routes ---
// POST /api/reports (Create Report)
// Any logged-in user can create a report
router.post("/", protect, upload.single("reportImage"), createReport);

// GET /api/reports/myreports (Get Citizen's own reports)
// Any logged-in user can get their own reports
router.get("/myreports", protect, getMyReports);

// --- Staff Only Routes ---
// GET /api/reports (Get ALL reports)
router.get("/", protect, authorize("staff"), getAllReports);

// PUT /api/reports/:id (Update Report Status)
router.put("/:id", protect, authorize("staff"), updateReportStatus);

module.exports = router;
