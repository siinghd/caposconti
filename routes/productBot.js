var express = require("express");
const {
  getAllProductsBot,
  getProductsByCateBot,
  getSearchedProductsBot,
  addProductsOfBot,
} = require("../controllers/productBot");
var router = express.Router();

router.get("/productsbot/:byCategory", getProductsByCateBot);
router.get("/productsbot", getAllProductsBot);
router.post("/searchbot", getSearchedProductsBot);
router.post("/addproductsbot", addProductsOfBot);

module.exports = router;
