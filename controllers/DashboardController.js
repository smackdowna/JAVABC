const ErrorHander = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const User = require("../models/UserModel");

exports.getDashboardStats = catchAsyncErrors(async (req, res, next) => {
  const userCount = await User.countDocuments({ role: "user" });
  const productsCount = await Product.countDocuments();

  // Sum of totalPrice for cancelled orders
  const resultCancelled = await Order.aggregate([
    {
      $match: {
        orderStatus: 'Cancelled' // Match orders with orderStatus 'cancelled'
      }
    },
    {
      $group: {
        _id: null,
        totalAmountCancelled: { $sum: '$totalPrice' } // Calculate the sum of the 'totalPrice' field
      }
    }
  ]).exec();

  const totalOrdersAmountCancelled = resultCancelled.length > 0 ? resultCancelled[0].totalAmountCancelled : 0;


  // // Sum of totalPrice for orders with orderStatus other than 'cancelled'
  const resultNotCancelled = await Order.aggregate([
    {
      $match: {
        orderStatus: { $ne: 'Cancelled' } // Exclude orders with orderStatus 'cancelled'
      }
    },
    {
      $group: {
        _id: null,
        totalAmountNotCancelled: { $sum: '$totalPrice' } // Calculate the sum of the 'totalPrice' field
      }
    }
  ]).exec();

  const totalOrdersAmount = resultNotCancelled.length > 0 ? resultNotCancelled[0].totalAmountNotCancelled : 0;



  const TotalOrders = await Order.countDocuments();
  const ordersPlaced = await Order.countDocuments({
    orderStatus: "Processing",
  });
  const orderShipped = await Order.countDocuments({ orderStatus: "Shipped" });
  const orderDelivered = await Order.countDocuments({
    orderStatus: "Delivered",
  });
  const orderCancelled = await Order.countDocuments({
    orderStatus: "Cancelled",
  });

  res.status(200).json({
    success: true,
    userCount,
    productsCount,
    TotalOrders,
    ordersPlaced,
    orderShipped,
    orderDelivered,
    orderCancelled,
    totalOrdersAmount,
    totalOrdersAmountCancelled,
  });
});



