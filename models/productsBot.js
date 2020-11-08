const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productBotSchema = new mongoose.Schema(
  {
    Title: {
      type: String,
      trim: true,

      maxlength: 255,
    },
    Description: {
      type: String,
      trim: true,

      maxlength: 2000,
    },
    DealPrice: {
      type: String,
      maxlength: 32,
      trim: true,
    },
    Price: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },
    OffertValue: String,
    Asin: {
      type: String,
      required: true,
    },
    Url: String,
    Rating: String,
    MerchantInfo: String,
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
    Image: String,
    TimeDeal: Date,
    Category: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductBot", productBotSchema);
