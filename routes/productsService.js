if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const assert = require("assert");
const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.username}:${process.env.password}@cluster0-1jamj.mongodb.net/StudentSystem?retryWrites=true&w=majority`;
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
  createProductEntry(res, entry).catch(console.error);
};

exports.getProduct = async function (req, res) {
  const query = req.query;
  const name = query.name;

  getOneProduct(name, res);
};

exports.getCategoryProducts = async function (req, res) {
  const query = req.query;
  const name = query.name;

  getProductsByCategory(res, name);
};

exports.updateProduct = async function (req, res) {
  const query = req.body;

  console.log(query);
  updateProductEntry(res, query).catch(console.error);
};

async function createProductEntry(res, entry) {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    await createEntry(res, client, entry);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

async function getOneProduct(name, res) {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    await getEntry(res, client, name);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

async function getProductsByCategory(res, category) {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    await getProductsFromCategory(res, client, category);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

async function updateProductEntry(res, query) {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const name = query.name;
    const update = query.update;
    await updateEntry(res, client, name, update);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

async function createEntry(res, client, entry) {
  try {
    const result = await client
      .db("CatsProds")
      .collection("Products")
      .insertOne(entry);

    console.log(
      `New product created with the following id: ${result.insertedId}`
    );
    res.sendStatus(200);
  } catch (error) {
    res
      .status(400)
      .end("Error in the create product request: " + error.message);
  }
}

async function getEntry(res, client, name) {
  try {
    const result = await client
      .db("CatsProds")
      .collection("Products")
      .findOne({ name: name });

    if (result) {
      res.send(result);
    } else {
      console.log(`No products found with the name '${name}'`);
      res.send(result);
    }
  } catch (error) {
    res.status(400).end("Error in get product request: " + error.message);
  }
}

async function getProductsFromCategory(res, client, category) {
  try {
    const result = await client
      .db("CatsProds")
      .collection("Products")
      .find({ categories: category })
      .toArray(function (err, docs) {
        console.log("Found the following records");
        console.log(docs);
        res.send(docs);
      });

    if (!result) console.log(`No products found with the name '${category}'`);
  } catch (error) {
    res
      .status(400)
      .end("Error in the get products by category request: " + error.message);
  }
}

async function updateEntry(res, client, name, update) {
  try {
    const result = await client
      .db("CatsProds")
      .collection("Products")
      .updateOne({ name: name }, { $set: update }, function (err, result) {
        assert.equal(err, null);
        console.log(`Updated the product with the field name equal to ${name}`);
      });

    res.sendStatus(200);
  } catch (error) {
    res
      .status(400)
      .end("Error in the update product request: " + error.message);
  }
}
