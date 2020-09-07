var express = require("express");
const {
  getProductById,
  getProduct,
  getAllProducts,
} = require("../controllers/product");
var router = express.Router();

router.param("productId", getProductById);
//read routes
router.get("/product/:productId", getProduct);
router.get("/products", getAllProducts);

module.exports = router;
