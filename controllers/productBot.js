const TopProdotti = require("../models/productsBot");

exports.addProductsOfBot = (req, res) => {
  let records = JSON.parse(req.body.records);
  records.forEach((element, index) => {
    let product = {
      Title: element.Title,
      Image: element.Image,
      DealPrice: element.DealPrice,
      Price: element.Price,
      Asin: element.Asin,
      TimeDeal: element.TimeDeal,
      Url: element.Url + "?tag=dealsdstg-21",
      Category: req.body.category,
      MerchantInfo: element.MerchantInfo,
      Rating: element.Rating,
      OffertValue: element.OffertValue,
    };

    let prodotto = new TopProdotti(product);
    prodotto.save((err, prodotto) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ err: "error" });
      }
      res.json({ done: "done" });
    });
  });
};
exports.getSearchedProductsBot = (req, res) => {
  console.log(req.body);
  TopProdotti.find({
    $or: [
      { name: { $regex: req.body.text, $options: "i" } },
      { category: { $regex: req.body.text, $options: "i" } },
    ],
  }).exec((err, products) => {
    if (err) {
      return res.status(400).json({
        error: "Product not found",
      });
    }
    console.log(products);
    res.json(products);
  });
};
exports.getAllProductsBot = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 20;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  TopProdotti.find()
    .sort([[sortBy, "asc"]])
    //.limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "No products found",
        });
      }
      res.json(products);
    });
};
exports.getProductByCategoryBot = (req, res, next, id) => {
  console.log(id);
  TopProdotti.find({ category: { $regex: id, $options: "i" } }).exec(
    (err, product) => {
      if (err) {
        console.log(err);
        return res.status(400).json({
          error: "Product not found",
        });
      }
      req.product = product;
      next();
    }
  );
};
exports.getProductsByCateBot = (req, res) => {
  return res.json(req.product);
};
