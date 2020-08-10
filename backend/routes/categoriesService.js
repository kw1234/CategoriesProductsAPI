const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://bgaskwarrier:kaw009020@cluster0-1jamj.mongodb.net/StudentSystem?retryWrites=true&w=majority";

exports.postData = async function (req, res) {
  let entry = req.body;
  console.log(entry);
  createCategoryEntry(entry).catch(console.error);
  res.sendStatus(200);
};

exports.getData = async function (req, res) {
  let params = req.params;
  console.log(params);
  const name = params.name;

  const result = getCategoryEntry(name);

  if (!result) res.error();
  res.send(result);
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
    console.log(result);
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

async function getCategoryEntry(name) {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  let entry = {};
  try {
    await client.connect();

    entry = await getEntry(client, name);
    console.log(entry);
    return entry;
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
  return entry;
}
