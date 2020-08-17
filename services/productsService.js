const assert = require("assert");
const validate = require("jsonschema").validate;

// Schema to compare new POST entries to
const prodSchema = {
  name: "string",
  price: "double",
  categories: {
    type: "array",
    items: { type: "string" },
  },
  required: ["name", "price", "categories"],
};

exports.postProduct = async function (req, res) {
  const entry = req.body;

  try {
    validate(entry, prodSchema, { throwError: true });
  } catch (error) {
    res.status(401).end("Invalid body format: " + error.message);
    return;
  }

  console.log(entry);
  createEntry(res, req.app.client, entry).catch((error) => {
    res
      .status(400)
      .end("Error in the create product request: " + error.message);
  });
};

exports.getProduct = async function (req, res) {
  const query = req.query;
  const name = query.name;

  getEntry(res, req.app.client, name).catch((error) => {
    res.status(400).end("Error in get product request: " + error.message);
  });
};

exports.getCategoryProducts = async function (req, res) {
  const query = req.query;
  const name = query.name;

  getProductsFromCategory(res, req.app.client, category).catch((error) => {
    res
      .status(400)
      .end("Error in the get products by category request: " + error.message);
  });
};

exports.updateProduct = async function (req, res) {
  const query = req.body;

  console.log(query);
  updateEntry(res, req.app.client, name, update).catch((error) => {
    res
      .status(400)
      .end("Error in the update product request: " + error.message);
  });
};

async function createEntry(res, client, entry) {
  const result = await client
    .db("CatsProds")
    .collection("Products")
    .insertOne(entry);

  res.sendStatus(200);
}

async function getEntry(res, client, name) {
  const result = await client
    .db("CatsProds")
    .collection("Products")
    .findOne({ name: name });

  res.send(result);
}

async function getProductsFromCategory(res, client, category) {
  const result = await client
    .db("CatsProds")
    .collection("Products")
    .find({ categories: category })
    .toArray(function (err, docs) {
      console.log("Found the following records");
      console.log(docs);
      res.send(docs);
    });
}

async function updateEntry(res, client, name, update) {
  const result = await client
    .db("CatsProds")
    .collection("Products")
    .updateOne({ name: name }, { $set: update }, function (err, result) {
      assert.equal(err, null);
      console.log(`Updated the product with the field name equal to ${name}`);
    });

  res.sendStatus(200);
}
