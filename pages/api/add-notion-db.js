const { Client } = require("@notionhq/client");
const { MongoClient } = require("mongodb");

/*
Could now be replaced by Server Actions. 
*/
export default async function addNotionDB(req, res) {
  try {
    const access_token = req.query.access_token;
    const notion = new Client({ auth: access_token });

    // TODO use next pointer
    const responseSearch = await notion.search({
      query: "Habit Tracker Database",
      filter: { value: "database", property: "object" },
    });
    let notionDBs = responseSearch.results.filter(
      (DB) => DB.title[0].plain_text === "Habit Tracker Database"
    );

    if (notionDBs.length === 0) {
      res.json({ foundDatabase: false });
      return;
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const site_collection = client.db("main").collection("sites");

    /*
    Suboptimal solution, the data should ideally be structured differently.
    */
    for (const notionDB of notionDBs) {
      await site_collection.deleteMany({
        database_id: notionDB.id,
      });
    }

    await site_collection.insertOne({
      database_id: notionDBs[0].id,
      access_token: access_token,
    });
    await client.close();

    res.json({ foundDatabase: true, database_id: notionDBs[0].id });
  } catch (error) {
    res.status(500).send();
  }
}
