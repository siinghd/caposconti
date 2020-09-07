const Product = require("../models/product");
const mongoose = require("mongoose");
const axios = require("axios");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id).exec((err, product) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: "Product not found",
      });
    }
    req.product = product;
    next();
  });
};

exports.getProduct = (req, res) => {
  return res.json(req.product);
};

exports.createProducts = () => {
  var now = new Date();
  var delay = 60 * 60 * 3000; // 1 hour in msec
  var start =
    delay -
    (now.getMinutes() * 60 + now.getSeconds()) * 1000 +
    now.getMilliseconds();

  setTimeout(function doSomething() {
    let prodottiInDb = [];
    Product.find().exec((err, products) => {
      if (err) {
        return "error";
      }
      prodottiInDb = products;
    });
    let found = false;
    // set up the request parameters
    const params = {
      api_key: "D34E7BC79682412E9B4399DE53688B3E",
      type: "deals",
      url: "https://www.amazon.it/gp/goldbox",
    };

    // make the http GET request to Rainforest API
    axios
      .get("https://api.rainforestapi.com/request", { params })
      .then((response) => {
        // print the JSON response from Rainforest API
        response.data.deals_results.forEach((item, index) => {
          found = false;
          if (item.list_price) {
            var product = {
              name: item.title,
              description: item.description,
              photo: item.image,
              discountprice: item.deal_price.value,
              price: item.list_price.value,
              asin: item.asin,
              amazonLink: item.link,
              amazonLinkOur: item.link + "/?tag=dealsdstg-21",
            };
            prodottiInDb.forEach((dbproduct) => {
              if (dbproduct.asin === item.asin) {
                found = true;
              }
            });
            console.log(found);
            if (!found) {
              let prodotto = new Product(product);
              prodotto.save((err, prodotto) => {
                if (err) {
                  console.log(err);
                }
              });
            }
          }
        });
      })
      .catch((error) => {
        // catch and print the error
        console.log(error);
      });
    setTimeout(doSomething, delay);
  }, start);
};

exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 20;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  Product.find()
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
