if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const assert = require("assert");
const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.username}:${process.env.password}@cluster0-1jamj.mongodb.net/StudentSystem?retryWrites=true&w=majority`;
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
  createCategoryEntry(res, entry).catch(console.error);
};

exports.getCategory = async function (req, res) {
  const query = req.query;
  const name = query.name;

  getOneCategory(name, res);
};

exports.getAllCategories = async function (req, res) {
  getMultipleCategories(res);
};

exports.updateCategory = async function (req, res) {
  const query = req.body;

  console.log(query);
  updateCategoryEntry(res, query).catch(console.error);
};

async function createCategoryEntry(res, entry) {
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

async function getOneCategory(name, res) {
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

async function getMultipleCategories(res) {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    await getAllEntries(res, client);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

async function updateCategoryEntry(res, query) {
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
      .collection("Categories")
      .insertOne(entry);
    console.log(
      `New category created with the following id: ${result.insertedId}`
    );
    res.sendStatus(200);
  } catch (error) {
    res
      .status(400)
      .end("Error in the create category request: " + error.message);
  }
}

async function getEntry(res, client, name) {
  try {
    const result = await client
      .db("CatsProds")
      .collection("Categories")
      .findOne({ name: name });

    if (result) {
      res.send(result);
    } else {
      console.log(`No categories found with the name '${name}'`);
      res.send(result);
    }
  } catch (error) {
    res.status(400).end("Error in the get category request: " + error.message);
  }
}

async function getAllEntries(res, client) {
  try {
    const result = await client
      .db("CatsProds")
      .collection("Categories")
      .find({})
      .toArray(function (err, docs) {
        console.log("Found the following Categories");
        console.log(docs);
        res.send(docs);
      });
  } catch (error) {
    res
      .status(400)
      .end("Error in the get all categories request: " + error.message);
  }
}

async function updateEntry(res, client, name, update) {
  try {
    const result = await client
      .db("CatsProds")
      .collection("Categories")
      .updateOne({ name: name }, { $set: update }, function (err, result) {
        assert.equal(err, null);
        console.log(update);
        console.log(
          `Updated the category with the field name equal to ${name}`
        );
        res.sendStatus(200);
      });
  } catch (error) {
    res
      .status(400)
      .end("Error in the update category request: " + error.message);
  }
}
