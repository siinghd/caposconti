require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const productRoutes = require("./routes/product");
const { createProducts } = require("./controllers/product");
mongoose
  .connect(
    "mongodb+srv://singh:K7nhMHqTfUSt7IDN@cluster0.bgnl4.mongodb.net/sconti",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  )
  .then(() => {
    console.log("DB CONNECTED");
  });

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
//my routes
//My Routes
app.use("/api", productRoutes);
createProducts();
//PORT
const port = process.env.PORT || 8000;

//Starting a server
app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
