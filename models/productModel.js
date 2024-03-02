const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter product Name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please Enter product Description"],
  },
  keyFeatures: {
    type: String,
    required: [true, "Please Enter keyFeatures"],
  },
  specification: {
    type: String,
    required: [true, "Please Enter product specification"],
  },
  baseprice: {
    type: Number,
    required: [true, "Please Enter base Price"],
    maxLength: [8, "Price cannot exceed 8 characters"],
  },
  discountedprice: {
    type: Number,
    required: [true, "Please Enter discounted price"],
    maxLength: [8, "Price cannot exceed 8 characters"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please Enter Product Category"],
  },
  sub_category: {
    type: String,
    required: [true, "Please Enter Product SubCategory"],
  },
  sub_category2: {
    type: String,
    default: "", // Optional: Set a default value if needed
  },
  size: {
    type: String,
    required: [true, "Please Enter Product Size"],
  },
  stock: {
    type: Number,
    required: [true, "Please Enter product Stock"],
    maxLength: [4, "Stock cannot exceed 4 characters"],
    default: 1,
  },
  color: {
    type: String,
  },
  Availablecolor: {
    type: String,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      avatar: {
        type: String,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
