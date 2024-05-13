const { Client } = require("@notionhq/client");
const { MongoClient } = require('mongodb');

export default async function redirect(req, res) {
  try {
    const token = req.query.token;
    const notion = new Client({ auth: token });
    const responseSearch = await notion.search({
      query: "Habit Tracker Database",
      filter: { value: "database", "property": "object" }
    });

    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const collection = client.db("main").collection("users");

    for (const elm of responseSearch.results) {
      var id = elm.id;
      await collection.deleteMany({
        id: id,
      });
    }

    await client.close();
    if (responseSearch.results.length === 0) {
      res.json({ success: false });
    } else {
      res.json({ success: true, id: id });
    }
  }
  catch (error) {
    res.status(500).send();
  }
}

//TODO make id an array -> with name to display in id
