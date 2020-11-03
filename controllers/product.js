const Product = require("../models/product");
const ProductBot = require("../models/productsBot");
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
exports.getProductByCategory = (req, res, next, id) => {
  Product.find({ category: { $regex: id, $options: "i" } }).exec(
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
exports.getProductsByCate = (req, res) => {
  return res.json(req.product);
};
exports.getProduct = (req, res) => {
  return res.json(req.product);
};

const fetchData = async (prodottiInDb, amazonLink, categoryOfLink) => {
  let found = false;
  // set up the request parameters
  const params = {
    api_key: "D34E7BC79682412E9B4399DE53688B3E",
    type: "deals",
    url: amazonLink,
  };

  // make the http GET request to Rainforest API
  axios
    .get("https://api.rainforestapi.com/request", { params })
    .then((response) => {
      // print the JSON response from Rainforest API
      response.data.deals_results.forEach((item, index) => {
        if (item.list_price) {
          let product = {
            name: item.title,
            description: item.description,
            photo: item.image,
            discountprice: item.deal_price.value,
            price: item.list_price.value,
            asin: item.asin,
            endDateTime: item.ends_at,
            amazonLink: item.link,
            amazonLinkOur: item.link + "?tag=dealsdstg-21",
            category: categoryOfLink,
          };
          let prodotto = new Product(product);
          prodotto.save((err, prodotto) => {
            if (err) {
              console.log(err);
            }
            console.log("saved");
          });
        }
      });
    })
    .catch((error) => {
      // catch and print the error
      console.log(error);
    });
};

exports.createProducts = () => {
  var now = new Date();
  var delay = 1000; // 1 hour in msec
  var start =
    delay -
    (now.getMinutes() * 60 + now.getSeconds()) * 1000 +
    now.getMilliseconds();

  setTimeout(function doSomething() {
    let prodottiInDb = [];
    let asinRemove = [];
    Product.find().exec((err, products) => {
      if (err) {
        return "error";
      }
      prodottiInDb = products;
      prodottiInDb.forEach((dbproduct) => {
        if (now > dbproduct.endDateTime) {
          console.log("adding removing products");
          asinRemove.push(dbproduct.asin);
        }
      });

      Product.deleteMany(
        {
          asin: {
            $in: asinRemove,
          },
        },
        (err) => {
          if (err) {
            /*fetchData(
              prodottiInDb,
              "https://www.amazon.it/gp/goldbox/ref=gbps_ftr_s-5_5d03_wht_42591603?gb_f_deals1=dealStates:AVAILABLE%252CWAITLIST%252CWAITLISTFULL%252CEXPIRED%252CSOLDOUT,sortOrder:BY_SCORE,enforcedCategories:425916031&pf_rd_p=2a05bf1c-4cd5-4cf9-b4e9-085858ee5d03&pf_rd_s=slot-5&pf_rd_t=701&pf_rd_i=gb_main&pf_rd_m=A11IL2PNWYJU7H&pf_rd_r=HPZYM2Z6GVM4862STXT8&ie=UTF8",
              "Informatica"
            );
            fetchData(
              prodottiInDb,
              "https://www.amazon.it/gp/goldbox/ref=gbps_ftr_s-5_9fdc_wht_28444330?gb_f_deals1=sortOrder:BY_SCORE,enforcedCategories:2844433031&pf_rd_p=e3352cfd-6885-47c5-8c7b-040f48979fdc&pf_rd_s=slot-5&pf_rd_t=701&pf_rd_i=gb_main&pf_rd_m=A11IL2PNWYJU7H&pf_rd_r=WTEF9BTQTXPPDVXQJ47C&nocache=1599569942829&ie=UTF8",
              "Abbigliamento"
            );
            fetchData(
              prodottiInDb,
              "https://www.amazon.it/gp/goldbox/ref=gbps_ftr_s-5_9fdc_wht_28085710?gb_f_deals1=sortOrder:BY_SCORE,enforcedCategories:2808571031&pf_rd_p=e3352cfd-6885-47c5-8c7b-040f48979fdc&pf_rd_s=slot-5&pf_rd_t=701&pf_rd_i=gb_main&pf_rd_m=A11IL2PNWYJU7H&pf_rd_r=WTEF9BTQTXPPDVXQJ47C&nocache=1599569942829&ie=UTF8",
              "Arredamento"
            );
            fetchData(
              prodottiInDb,
              "https://www.amazon.it/gp/goldbox/ref=gbps_ftr_s-5_9fdc_wht_61980820?gb_f_deals1=sortOrder:BY_SCORE,enforcedCategories:6198082031&pf_rd_p=e3352cfd-6885-47c5-8c7b-040f48979fdc&pf_rd_s=slot-5&pf_rd_t=701&pf_rd_i=gb_main&pf_rd_m=A11IL2PNWYJU7H&pf_rd_r=WTEF9BTQTXPPDVXQJ47C&nocache=1599569942829&ie=UTF8",
              "Bellezza"
            );
            fetchData(
              prodottiInDb,
              "https://www.amazon.it/gp/goldbox/ref=gbps_ftr_s-5_9fdc_wht_52401503?gb_f_deals1=sortOrder:BY_SCORE,enforcedCategories:524015031&pf_rd_p=e3352cfd-6885-47c5-8c7b-040f48979fdc&pf_rd_s=slot-5&pf_rd_t=701&pf_rd_i=gb_main&pf_rd_m=A11IL2PNWYJU7H&pf_rd_r=WTEF9BTQTXPPDVXQJ47C&nocache=1599569942829&ie=UTF8",
              "CasaeCucina"
            );
            fetchData(
              prodottiInDb,
              "https://www.amazon.it/gp/goldbox/ref=gbps_ftr_s-5_9fdc_wht_14972280?gb_f_deals1=sortOrder:BY_SCORE,enforcedCategories:1497228031&pf_rd_p=e3352cfd-6885-47c5-8c7b-040f48979fdc&pf_rd_s=slot-5&pf_rd_t=701&pf_rd_i=gb_main&pf_rd_m=A11IL2PNWYJU7H&pf_rd_r=WTEF9BTQTXPPDVXQJ47C&nocache=1599569942829&ie=UTF8",
              "CellularieAccessori"
            );
            fetchData(
              prodottiInDb,
              "https://www.amazon.it/gp/goldbox/ref=gbps_ftr_s-5_9fdc_wht_47336503?gb_f_deals1=sortOrder:BY_SCORE,enforcedCategories:473365031&pf_rd_p=e3352cfd-6885-47c5-8c7b-040f48979fdc&pf_rd_s=slot-5&pf_rd_t=701&pf_rd_i=gb_main&pf_rd_m=A11IL2PNWYJU7H&pf_rd_r=WTEF9BTQTXPPDVXQJ47C&nocache=1599569942829&ie=UTF8",
              "Cuffie"
            );
            fetchData(
              prodottiInDb,
              "https://www.amazon.it/gp/goldbox/ref=gbps_fcr_s-5_9fdc_wht_47336503?gb_f_deals1=sortOrder:BY_SCORE,enforcedCategories:1571289031&pf_rd_p=e3352cfd-6885-47c5-8c7b-040f48979fdc&pf_rd_s=slot-5&pf_rd_t=701&pf_rd_i=gb_main&pf_rd_m=A11IL2PNWYJU7H&pf_rd_r=WTEF9BTQTXPPDVXQJ47C&nocache=1599569942829&ie=UTF8",
              "CuraDellaPersona"
            );
            fetchData(
              prodottiInDb,
              "https://www.amazon.it/gp/goldbox/ref=gbps_fcr_s-5_9fdc_wht_15712890?gb_f_deals1=sortOrder:BY_SCORE,enforcedCategories:827181031&pf_rd_p=e3352cfd-6885-47c5-8c7b-040f48979fdc&pf_rd_s=slot-5&pf_rd_t=701&pf_rd_i=gb_main&pf_rd_m=A11IL2PNWYJU7H&pf_rd_r=WTEF9BTQTXPPDVXQJ47C&nocache=1599569942829&ie=UTF8",
              "DispositiviAmazon"
            );*/
            console.log("error removing products");
          } else {
            /* console.log("removing products");
            console.log(asinRemove);
            fetchData(
              prodottiInDb,
              "https://www.amazon.it/gp/goldbox/ref=gbps_ftr_s-5_5d03_wht_42591603?gb_f_deals1=dealStates:AVAILABLE%252CWAITLIST%252CWAITLISTFULL%252CEXPIRED%252CSOLDOUT,sortOrder:BY_SCORE,enforcedCategories:425916031&pf_rd_p=2a05bf1c-4cd5-4cf9-b4e9-085858ee5d03&pf_rd_s=slot-5&pf_rd_t=701&pf_rd_i=gb_main&pf_rd_m=A11IL2PNWYJU7H&pf_rd_r=HPZYM2Z6GVM4862STXT8&ie=UTF8",
              "Informatica"
            );
            fetchData(
              prodottiInDb,
              "https://www.amazon.it/gp/goldbox/ref=gbps_ftr_s-5_9fdc_wht_28444330?gb_f_deals1=sortOrder:BY_SCORE,enforcedCategories:2844433031&pf_rd_p=e3352cfd-6885-47c5-8c7b-040f48979fdc&pf_rd_s=slot-5&pf_rd_t=701&pf_rd_i=gb_main&pf_rd_m=A11IL2PNWYJU7H&pf_rd_r=WTEF9BTQTXPPDVXQJ47C&nocache=1599569942829&ie=UTF8",
              "Abbigliamento"
            );
            fetchData(
              prodottiInDb,
              "https://www.amazon.it/gp/goldbox/ref=gbps_ftr_s-5_9fdc_wht_28085710?gb_f_deals1=sortOrder:BY_SCORE,enforcedCategories:2808571031&pf_rd_p=e3352cfd-6885-47c5-8c7b-040f48979fdc&pf_rd_s=slot-5&pf_rd_t=701&pf_rd_i=gb_main&pf_rd_m=A11IL2PNWYJU7H&pf_rd_r=WTEF9BTQTXPPDVXQJ47C&nocache=1599569942829&ie=UTF8",
              "Arredamento"
            );
            fetchData(
              prodottiInDb,
              "https://www.amazon.it/gp/goldbox/ref=gbps_ftr_s-5_9fdc_wht_61980820?gb_f_deals1=sortOrder:BY_SCORE,enforcedCategories:6198082031&pf_rd_p=e3352cfd-6885-47c5-8c7b-040f48979fdc&pf_rd_s=slot-5&pf_rd_t=701&pf_rd_i=gb_main&pf_rd_m=A11IL2PNWYJU7H&pf_rd_r=WTEF9BTQTXPPDVXQJ47C&nocache=1599569942829&ie=UTF8",
              "Bellezza"
            );
            fetchData(
              prodottiInDb,
              "https://www.amazon.it/gp/goldbox/ref=gbps_ftr_s-5_9fdc_wht_52401503?gb_f_deals1=sortOrder:BY_SCORE,enforcedCategories:524015031&pf_rd_p=e3352cfd-6885-47c5-8c7b-040f48979fdc&pf_rd_s=slot-5&pf_rd_t=701&pf_rd_i=gb_main&pf_rd_m=A11IL2PNWYJU7H&pf_rd_r=WTEF9BTQTXPPDVXQJ47C&nocache=1599569942829&ie=UTF8",
              "CasaeCucina"
            );
            fetchData(
              prodottiInDb,
              "https://www.amazon.it/gp/goldbox/ref=gbps_ftr_s-5_9fdc_wht_14972280?gb_f_deals1=sortOrder:BY_SCORE,enforcedCategories:1497228031&pf_rd_p=e3352cfd-6885-47c5-8c7b-040f48979fdc&pf_rd_s=slot-5&pf_rd_t=701&pf_rd_i=gb_main&pf_rd_m=A11IL2PNWYJU7H&pf_rd_r=WTEF9BTQTXPPDVXQJ47C&nocache=1599569942829&ie=UTF8",
              "CellularieAccessori"
            );
            fetchData(
              prodottiInDb,
              "https://www.amazon.it/gp/goldbox/ref=gbps_ftr_s-5_9fdc_wht_47336503?gb_f_deals1=sortOrder:BY_SCORE,enforcedCategories:473365031&pf_rd_p=e3352cfd-6885-47c5-8c7b-040f48979fdc&pf_rd_s=slot-5&pf_rd_t=701&pf_rd_i=gb_main&pf_rd_m=A11IL2PNWYJU7H&pf_rd_r=WTEF9BTQTXPPDVXQJ47C&nocache=1599569942829&ie=UTF8",
              "Cuffie"
            );
            fetchData(
              prodottiInDb,
              "https://www.amazon.it/gp/goldbox/ref=gbps_fcr_s-5_9fdc_wht_47336503?gb_f_deals1=sortOrder:BY_SCORE,enforcedCategories:1571289031&pf_rd_p=e3352cfd-6885-47c5-8c7b-040f48979fdc&pf_rd_s=slot-5&pf_rd_t=701&pf_rd_i=gb_main&pf_rd_m=A11IL2PNWYJU7H&pf_rd_r=WTEF9BTQTXPPDVXQJ47C&nocache=1599569942829&ie=UTF8",
              "CuraDellaPersona"
            );
            fetchData(
              prodottiInDb,
              "https://www.amazon.it/gp/goldbox/ref=gbps_fcr_s-5_9fdc_wht_15712890?gb_f_deals1=sortOrder:BY_SCORE,enforcedCategories:827181031&pf_rd_p=e3352cfd-6885-47c5-8c7b-040f48979fdc&pf_rd_s=slot-5&pf_rd_t=701&pf_rd_i=gb_main&pf_rd_m=A11IL2PNWYJU7H&pf_rd_r=WTEF9BTQTXPPDVXQJ47C&nocache=1599569942829&ie=UTF8",
              "DispositiviAmazon"
            );*/
          }
        }
      );
    });

    console.log("requesting");
    //setTimeout(doSomething, delay);
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
exports.getSearchedProducts = (req, res) => {
  console.log(req.body);
  Product.find({
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
    res.json(products);
  });
};

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

    let prodotto = new ProductBot(product);
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
  ProductBot.find({
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
    res.json(products);
  });
};
exports.getAllProductsBot = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 20;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  ProductBot.find()
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
  ProductBot.find({ category: { $regex: id, $options: "i" } }).exec(
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
