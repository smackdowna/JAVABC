const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const User = require("../models/UserModel");

// Create new Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    discount,
  } = req.body;

  if (
    !shippingInfo ||
    !orderItems ||
    !paymentInfo ||
    !itemsPrice ||
    !taxPrice ||
    !shippingPrice ||
    !totalPrice ||
    !discount
  )
    return next(new ErrorHander("please enter all details", 400));

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    discount,
    paidAt: Date.now(),
    user: req.user._id,
  });

  order.orderItems.forEach(async (o) => {
    await updateStock(o.product, o.quantity);
  });

  res.status(201).json({
    success: true,
    message: "We have recieved your Order",
  });
});

// get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  

  const id = order.user;

  const user = await User.findById(id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
    userdetails: {
      name: `${user.full_name}`,
      email: `${user.email}`,
    },
  });
});

// get logged in user  Orders
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

// get all Orders -- Admin
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const ordersCount = await Order.countDocuments();
  const orders = await Order.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    ordersCount,
    orders,
  });
});

// update Order Status -- Admin
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHander("You have already delivered this order", 400));
  }

  order.orderStatus = req.body.status;

  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    message: "order updated",
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.stock -= quantity;

  await product.save({ validateBeforeSave: false });
}

// delete Order -- Admin
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
    message: "Order Deleted",
  });
});

//cancel order Status
exports.cancelOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  order.orderStatus = "cancelled";

  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    message: "Your order is cancelled",
  });
});
