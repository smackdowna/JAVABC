const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { getDashboardStats } = require("../controllers/DashboardController");



router
  .route("/admin/dashboard")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getDashboardStats);


module.exports = router;