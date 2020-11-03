var express = require("express");
const {
  getProductById,
  getProduct,
  getAllProducts,
  getProductByCategory,
  getProductsByCate,
  getAllProductsBot,
  getProductsByCateBot,
  getSearchedProducts,
  getSearchedProductsBot,
  addProductsOfBot,
} = require("../controllers/product");
var router = express.Router();

router.param("productId", getProductById);
router.param("byCategory", getProductByCategory);
//read routes
router.get("/product/:productId", getProduct);
router.get("/products/:byCategory", getProductsByCate);
router.get("/products", getAllProducts);
router.post("/search", getSearchedProducts);
router.get("/productsbot/:byCategory", getProductsByCateBot);
router.get("/productsbot", getAllProductsBot);
router.post("/searchbot", getSearchedProductsBot);
router.post("/addproductsbot", addProductsOfBot);

module.exports = router;
