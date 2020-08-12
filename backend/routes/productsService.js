if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.username}:${process.env.password}@cluster0-1jamj.mongodb.net/StudentSystem?retryWrites=true&w=majority`;
const validate = require("jsonschema").validate;

const prodSchema = {
  name: "string",
  price: "double",
  categories: {
    type: "array",
    items: { type: "string" },
  },
  required: ["name", "price", "categories"],
};

exports.postData = async function (req, res) {
  const entry = req.body;

  try {
    validate(entry, prodSchema, { throwError: true });
  } catch (error) {
    res.status(401).end("Invalid body format: " + error.message);
    return;
  }

  console.log(entry);
  createProductEntry(entry).catch(console.error);
  res.sendStatus(200);
};

exports.getData = async function (req, res) {
  let body = req.body;
  console.log(req.body);
  const name = body.name;

  const result = getProduct(name, res);
  //console.log(result);

  if (!result) res.error();
  //res.send(result);
};

exports.getCategoryProducts = async function (req, res) {
  let body = req.body;
  console.log(req.body);
  const name = body.name;

  const result = getProductsByCategory(name, res);
  //console.log(result);

  if (!result) res.error();
  //res.send(result);
};

async function createEntry(client, entry) {
  const result = await client
    .db("CatsProds")
    .collection("Products")
    .insertOne(entry);
  console.log(
    `New product created with the following id: ${result.insertedId}`
  );
}

async function getEntry(client, name) {
  const result = await client
    .db("CatsProds")
    .collection("Products")
    .findOne({ name: name });

  if (result) {
    //console.log(result);
    return result;
  } else {
    console.log(`No products found with the name '${name}'`);
  }
}

async function getProductsFromCategory(res, client, category) {
  const result = await client
    .db("CatsProds")
    .collection("Products")
    .find({ name: name });

  if (result) {
    //console.log(result);
    return result;
  } else {
    console.log(`No products found with the name '${name}'`);
  }
}

async function createProductEntry(entry) {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect();

    await createEntry(client, entry);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

async function getProduct(name, res) {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  let entry = {};
  try {
    await client.connect();

    entry = await getEntry(client, name);
    console.log(entry);
    res.send(entry);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
  return entry;
}

async function getProductsByCategory(res, category) {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  let entry = {};
  try {
    await client.connect();

    entry = await getProductsFromCategory(res, client, name);
    console.log(entry);
    res.send(entry);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
  return entry;
}

async function validateEntry(entry, res) {
  try {
    validate(entry, catSchema, { throwError: true });
    return "OK";
  } catch (error) {
    sendValidationError(
      res,
      "Invalid body format in product entry: " + error.message
    );
  }
}

function sendValidationError(res, message) {
  console.log("error in validation");
  return res.json({ success: false, message: message });
}
