const ErrorHander = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const Coupon = require("../models/couponModel");

//create new coupon
exports.newCoupon = catchAsyncErrors(async (req, res, next) => {
    const { code, amount } = req.body;

    if (!code || !amount)
      return next(new ErrorHander("Please enter both coupon and amount", 400));
  
    await Coupon.create({ code, amount });
  
    return res.status(201).json({
      success: true,
      message: `Coupon ${code} Created Successfully`,
    });
});

//Apply discount
exports.applyDiscount = catchAsyncErrors(async (req, res, next) => {
  const { code } = req.query;

  const discount = await Coupon.findOne({ code });

  if (!discount) return next(new ErrorHander("Invalid coupon code", 400));

  return res.status(201).json({
    success: true,
    discount: discount.amount,
  });
});

//all coupons
exports.allCoupons = catchAsyncErrors(async (req, res, next) => {
  const couponCount = await Coupon.countDocuments();
  const coupons = await Coupon.find().sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    coupons,
    couponCount,
  });
});

//delete coupon
exports.deleteCoupon = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const coupon = await Coupon.findByIdAndDelete(id);

  if (!coupon) return next(new ErrorHander("Coupon not found", 400));

  return res.status(200).json({
    success: true,
    message: `Coupon  Deleted Successfully`,
  });
});
