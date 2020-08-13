const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { lstat } = require("fs");
const app = express();
const catService = require("./routes/categoriesService");
const prodService = require("./routes/productsService");

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

const catApi = express.Router();
const prodApi = express.Router();

app.get("/", function (req, res) {
  res.send("Categories/Products API");
});

catApi.post("/postCategory", catService.postCategory);
catApi.get("/getCategory", catService.getCategory);
catApi.get("/getAllCategories", catService.getAllCategories);
catApi.put("/updateCategory", catService.updateCategory);

prodApi.post("/postProduct", prodService.postProduct);
prodApi.get("/getProduct", prodService.getProduct);
prodApi.get("/getProductsByCategory", prodService.getCategoryProducts);
prodApi.put("/updateProduct", prodService.updateProduct);

app.use("/categories", catApi);
app.use("/products", prodApi);

app.listen(8080);
