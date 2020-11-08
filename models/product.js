const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,

      maxlength: 255,
    },
    description: {
      type: String,
      trim: true,

      maxlength: 2000,
    },
    discountprice: {
      type: Number,
      maxlength: 32,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      maxlength: 32,
      trim: true,
    },
    asin: {
      type: String,
      required: true,
    },
    amazonLink: String,
    amazonLinkOur: String,

    /*category: [
      {
        type: ObjectId,
        ref: "Category",
        required: true,
      },
    ],*/
    /*subcategory: [
      {
        type: ObjectId,
        ref: "SubCategory",
        required: true,
      },
    ],*/
    photo: String,
    endDateTime: Date,
    category: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
