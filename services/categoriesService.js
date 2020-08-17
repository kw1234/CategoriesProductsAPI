const assert = require("assert");
const validate = require("jsonschema").validate;

// Schema to compare new POST entries to
const catSchema = {
  name: "string",
  childCategories: {
    type: "array",
    items: { type: "object" },
  },
  required: ["name", "childCategories"],
};

exports.postCategory = async function (req, res) {
  const entry = req.body;

  try {
    validate(entry, catSchema, { throwError: true });
  } catch (error) {
    res.status(401).end("Invalid body format: " + error.message);
    return;
  }

  console.log(entry);
  createEntry(res, req.app.client, entry).catch((error) => {
    res
      .status(400)
      .end("Error in the create category request: " + error.message);
  });
};

exports.getCategory = async function (req, res) {
  const query = req.query;
  const name = query.name;

  getEntry(res, req.app.client, name).catch((error) => {
    res.status(400).end("Error in the get category request: " + error.message);
  });
};

exports.getAllCategories = async function (req, res) {
  getAllEntries(res, req.app.client).catch((error) => {
    res
      .status(400)
      .end("Error in the get all categories request: " + error.message);
  });
};

exports.updateCategory = async function (req, res) {
  const query = req.body;

  console.log(query);
  updateEntry(res, req.app.client, name, update).catch((error) => {
    res
      .status(400)
      .end("Error in the update category request: " + error.message);
  });
};

async function createEntry(res, client, entry) {
  const result = await client
    .db("CatsProds")
    .collection("Categories")
    .insertOne(entry);
  res.sendStatus(200);
}

async function getEntry(res, client, name) {
  const result = await client
    .db("CatsProds")
    .collection("Categories")
    .findOne({ name: name });

  res.send(result);
}

async function getAllEntries(res, client) {
  const result = await client
    .db("CatsProds")
    .collection("Categories")
    .find({})
    .toArray(function (err, docs) {
      res.send(docs);
    });
}

async function updateEntry(res, client, name, update) {
  const result = await client
    .db("CatsProds")
    .collection("Categories")
    .updateOne({ name: name }, { $set: update }, function (err, result) {
      assert.equal(err, null);
      res.sendStatus(200);
    });
}
