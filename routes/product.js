var express = require("express");
const {
  getProductById,
  getProduct,
  getAllProducts,
  getProductByCategory,
  getProductsByCate,
  getSearchedProducts,
} = require("../controllers/product");
var router = express.Router();

router.param("productId", getProductById);
router.param("byCategory", getProductByCategory);
//read routes
router.get("/product/:productId", getProduct);
router.get("/products/:byCategory", getProductsByCate);
router.get("/products", getAllProducts);
router.post("/search", getSearchedProducts);

module.exports = router;
