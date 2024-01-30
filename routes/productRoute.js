const express = require("express");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const {
  createProduct,
  getAllProducts,
  getProductDetails,
  updateProduct,
  deleteProduct,
  getAllCategories,
  createProductReview,
  getProductReviews,
  deleteReview,
  getAdminProducts,
} = require("../controllers/productController");
const multipleUpload = require("../middleware/multipleMulter");

const router = express.Router();

//create product
router
  .route("/createproduct")
  .post(
    isAuthenticatedUser,
    authorizeRoles("admin"),
    multipleUpload,
    createProduct
  );

router.route("/products").get(getAllProducts);

router.route("/product/categories").get(getAllCategories);

router.route("/admin/product").get(isAuthenticatedUser,authorizeRoles("admin"),getAdminProducts);

router
  .route("/product/:id")
  .get(getProductDetails)
  .put(isAuthenticatedUser, authorizeRoles("admin"),multipleUpload, updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"),deleteProduct);

router.route("/review").put(isAuthenticatedUser, createProductReview);

router
  .route("/reviews")
  .get(getProductReviews)
  .delete(isAuthenticatedUser, deleteReview);

module.exports = router;
