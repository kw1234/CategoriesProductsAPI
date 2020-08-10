const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://bgaskwarrier:kaw009020@cluster0-1jamj.mongodb.net/StudentSystem?retryWrites=true&w=majority";
const validate = require("jsonschema").validate;

const catSchema = {
  name: "string",
  childCategories: {
    type: "array",
    items: { type: "string" },
  },
  required: ["name", "childCategories"],
};

exports.postData = async function (req, res) {
  const entry = req.body;

  /*let validatePromise = new Promise(validateEntry(entry));
  validatePromise
    .then((result) => {
      console.log("Success", result);
    })
    .catch((error) => {
      console.log("Error", error);
    });*/
  try {
    validate(entry, catSchema, { throwError: true });
  } catch (error) {
    res.status(401).end("Invalid body format: " + error.message);
    return;
  }

  console.log(entry);
  createCategoryEntry(entry).catch(console.error);
  res.sendStatus(200);
};

exports.getData = async function (req, res) {
  let body = req.body;
  console.log(req.body);
  const name = body.name;

  const result = getCategory(name, res);
  //console.log(result);

  if (!result) res.error();
  //res.send(result);
};

async function createEntry(client, entry) {
  const result = await client
    .db("CatsProds")
    .collection("Categories")
    .insertOne(entry);
  console.log(
    `New category created with the following id: ${result.insertedId}`
  );
}

async function getEntry(client, name) {
  const result = await client
    .db("CatsProds")
    .collection("Categories")
    .findOne({ name: name });

  if (result) {
    //console.log(result);
    return result;
  } else {
    console.log(`No categories found with the name '${name}'`);
  }
}

async function createCategoryEntry(entry) {
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

async function getCategory(name, res) {
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

async function validateEntry(entry, res) {
  try {
    validate(entry, catSchema, { throwError: true });
    return "OK";
  } catch (error) {
    sendValidationError(
      res,
      "Invalid body format in category entry: " + error.message
    );
  }
}

function sendValidationError(res, message) {
  console.log("error in validation");
  return res.json({ success: false, message: message });
}
