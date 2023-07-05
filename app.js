const express = require("express");
const productRoutes = require("./src/routes/productRoute");
const app = express();

app.use(express.json());

app.use("/api/v1/products", productRoutes);

module.exports = app;
