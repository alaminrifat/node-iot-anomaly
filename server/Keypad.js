const express = require("express");
const bodyParser = require("body-parser");
const { connect } = require("./db");
const fs = require("fs").promises;
const path = require("path");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

async function setupRoutes() {
  const db = await connect();
  const espData = db.collection("keyboardData");

  function generateTimestamp() {
    const now = new Date();
    return `${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}_${now
      .getHours()
      .toString()
      .padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}${now
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;
  }

  async function saveDataToFile(data) {
    const timestamp = generateTimestamp();

    const filePathJson = path.join(
      __dirname,
      "../exports",
      `keyboardData_${timestamp}.json`
    );
    await fs.writeFile(filePathJson, JSON.stringify(data, null, 2));
    console.log("JSON File successfully saved at:", filePathJson);

    const filePathCsv = path.join(
      __dirname,
      "../exports",
      `keyboardData_${timestamp}.csv`
    );
    const csvWriter = createCsvWriter({
      path: filePathCsv,
      header: Object.keys(data[0]).map((key) => ({ id: key, title: key })),
    });
    await csvWriter.writeRecords(data);
    console.log("CSV File successfully saved at:", filePathCsv);

    return { json: filePathJson, csv: filePathCsv };
  }

  router.get("/", async (req, res) => {
    const keyboardPress = await espData.find().toArray();
    const totalData = keyboardPress.length;
    console.log({ totalData: totalData, data: keyboardPress });
    res.send({ totalData: totalData, data: keyboardPress });
  });

  router.post("/", async (req, res) => {
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

  router.get("/file", async (req, res) => {
    try {
      const keyboardPress = await espData.find().toArray();
      const totalData = keyboardPress.length;

      const fileUrls = await saveDataToFile(keyboardPress);

      console.log({ totalData: totalData, data: keyboardPress, fileUrls });
      // {
      //   totalData: totalData,
      //   data: keyboardPress,
      //   fileUrls: fileUrls,
      // }
      res.send(fileUrls);
    } catch (error) {
      console.error("Error exporting keypad data:", error);
      res.status(500).send("Internal Server Error");
    }
  });
}

setupRoutes().catch(console.dir);

module.exports = router;
