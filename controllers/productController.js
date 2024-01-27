const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require("cloudinary");
const getDataUri = require("../utils/dataUri");
const User = require("../models/UserModel");

// Create Product -- Admin
// exports.createProduct = catchAsyncErrors(async (req, res, next) => {
//   const { name, description, price, category, stock } = req.body;
//   //const images = req.files; // Assuming you are using multer or similar middleware for multiple file uploads

//   if (!name || !description || !price || !category || !stock) {
//     return next(new ErrorHander("All Field Required", 404));
//   }

//   const product = await Product.create({
//     name,
//     description,
//     price,
//     category,
//     stock,
//     images: [
//       {
//         public_id: "gfyzbc",
//         url: "fycg",
//       },
//     ],
//   });

//   res.status(201).json({
//     success: true,
//     product,
//   });
// });

//Create Product -- Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  const {
    name,
    description,
    price,
    category,
    sub_category,
    sub_category2,
    size,
    stock,
  } = req.body;
  const images = req.files; // Assuming you are using multer or similar middleware for multiple file uploads

  if (
    !name ||
    !description ||
    !price ||
    !category ||
    !stock ||
    !sub_category ||
    !size
  ) {
    return next(new ErrorHander("All Field Required", 404));
  }

  const productImages = [];

  if (images && images.length > 0) {
    for (const image of images) {
      const fileUri = getDataUri(image);
      const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

      productImages.push({
        public_id: mycloud.public_id,
        url: mycloud.secure_url,
      });
    }
  }

  await Product.create({
    name,
    description,
    price,
    category,
    stock,
    sub_category,
    size,
    sub_category2,
    images: productImages,
  });

  res.status(201).json({
    success: true,
    message: "Product Created Successfully",
  });
});

// Get All Product
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 10 ;
  const productsCount = await Product.countDocuments();

  const apiFeature = new ApiFeatures(Product.find().sort({ createdAt: -1 }), req.query)
    .search()
    .filter();

  let products = await apiFeature.query;

  let filteredProductsCount = products.length;

  apiFeature.pagination(resultPerPage);

  products = await apiFeature.query;

  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
});

//get All categories
exports.getAllCategories = catchAsyncErrors(async (req, res, next) => {
  const categories = await Product.distinct("category");

  res.status(200).json({
    success: true,
    categories,
  });
});

// Get All Product (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    products,
  });
});

// Get Product Details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Update Product -- Admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  // Handle product details update
  product.set(req.body);
  await product.save();

  // Handle image updates
  const images = req.files; // Assuming you are using multer or similar middleware for multiple file uploads

  if (images && images.length > 0) {
    const updatedImages = [];

    for (const image of images) {
      const fileUri = getDataUri(image);
      const myCloud = await cloudinary.uploader.upload(fileUri.content);

      updatedImages.push({
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      });
    }

    // Delete existing images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const existingImage of product.images) {
        await cloudinary.uploader.destroy(existingImage.public_id);
      }
    }

    // Update product with new images
    product.images = updatedImages;
    await product.save();
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Delete Product
// exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
//   const product = await Product.findById(req.params.id);

//   if (!product) {
//     return next(new ErrorHander("Product not found", 404));
//   }

//   // Delete images from Cloudinary
//   if (product.images && product.images.length > 0) {
//     for (const image of product.images) {
//       await cloudinary.uploader.destroy(image.public_id);
//     }
//   }

//   await product.remove();

//   res.status(200).json({
//     success: true,
//     message: "Product Delete Successfully",
//   });
// });

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const productId = req.params.id;

  // Find the product to be deleted
  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  // Delete images from Cloudinary
  if (product.images && product.images.length > 0) {
    for (const image of product.images) {
      await cloudinary.uploader.destroy(image.public_id);
    }
  }

  // Remove the product from wishlists of all users
  await User.updateMany(
    { 'wishlist.product': productId },
    { $pull: { wishlist: { product: productId } } }
  );

  // Remove the product itself
  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});



// Create New Review or Update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  if (!comment || !rating || !productId)
    return next(new ErrorHander("Please Enter Your Comments and Ratings", 400));

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Your Review is Submitted",
  });
});

// Get All Reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    message: "Review Deleted",
  });
});
