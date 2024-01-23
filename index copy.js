const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
const port = 3000; // Change this to your desired port
const { MongoClient, ServerApiVersion } = require("mongodb");

console.log(process.env.DB_USER);
// Middleware for parsing JSON and URL-encoded form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7luexbj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    await client.connect();
    const espData = client.db("ESP_DB").collection("keyboardData");

    app.get("/keypad", async (req, res) => {
      const keyboardPress = await espData.find().toArray();
      const totalData = keyboardPress.length;
      console.log({ totalData: totalData, data: keyboardPress });
      res.send({ totalData: totalData, data: keyboardPress });
    });

    app.post("/keypad", async (req, res) => {
      try {
        const keypadData = req.body.key;
        const currentTime = new Date();
        const data = {
          data: keypadData,
          createdAt: currentTime,
        };
        const result = await espData.insertOne(data);
        const response = {
          message: "Data stored successfully",
          id: result?.insertedId,
        };
        console.log(response);
        res.status(200).send(response);
      } catch (error) {
        console.error("Error storing keypad data:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// app.get("/keypad", (req, res) => {
//     console.log("Received Keypad Data:");

//     res.sendStatus(200).send("Keypad hitted");
// });

app.get("/", (req, res) => {
  res.send("ok"); // Respond with a success status code
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
