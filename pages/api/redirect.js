const axios = require("axios");
const { MongoClient } = require("mongodb");

export default async function redirect(req, res) {
  try {
    const tempAuthCode = req.query.code;
    const encoded = Buffer.from(
      `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
    ).toString("base64");
    const responseAuth = await axios({
      method: "post",
      url: "https://api.notion.com/v1/oauth/token",
      data: {
        grant_type: "authorization_code",
        code: tempAuthCode,
        redirect_uri: "https://notion.mauricekuehl.com/api/redirect",
      },
      headers: {
        Authorization: `Basic ${encoded}`,
        "Content-Type": "application/json",
      },
    });
    res.redirect(
      301,
      `https://notion.mauricekuehl.com/setup/add-db?access_token=${responseAuth.data.access_token}`
    );

    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const collection = client.db("main").collection("users");

    await collection.deleteOne({
      access_token: responseAuth.data.access_token,
    });

    await collection.insertOne(responseAuth.data);
    await client.close();
  } catch (error) {
    res.status(500).send();
  }
}
