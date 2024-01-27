const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const {
  newCoupon,
  applyDiscount,
  allCoupons,
  deleteCoupon,
} = require("../controllers/couponController");
const { processPayment, sendStripeApiKey } = require("../controllers/paymentController");

//////////////////Payment Route/////////////////////////

router.route("/createpayment").post(isAuthenticatedUser,processPayment);

router.route("/stripeapikey").get(isAuthenticatedUser, sendStripeApiKey);

//////////////////////////COUPON ROUTE///////////////////
router
  .route("/coupon/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), newCoupon);

router.route("/discount").get(isAuthenticatedUser, applyDiscount);

router
  .route("/coupon/all")
  .get(isAuthenticatedUser, authorizeRoles("admin"), allCoupons);

router
  .route("/coupon/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteCoupon);

module.exports = router;
