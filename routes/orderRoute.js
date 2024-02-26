const express = require("express");
const {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
  cancelOrder,
} = require("../controllers/orderController");
const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const {
  checkout,
  paymentVerification,
} = require("../controllers/paymentController");

router.route("/order/new").post(isAuthenticatedUser, newOrder);

router
  .route("/order/:id")
  .get(isAuthenticatedUser, getSingleOrder)
  .put(isAuthenticatedUser, cancelOrder);

router.route("/orders/me").get(isAuthenticatedUser, myOrders);

router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

router.route("/order/cancel/:id").put(isAuthenticatedUser, cancelOrder);

//checkout
router.route("/checkout").post(isAuthenticatedUser, checkout);

//payment verification
router
  .route("/paymentverification")
  .post(isAuthenticatedUser, paymentVerification);

module.exports = router;
