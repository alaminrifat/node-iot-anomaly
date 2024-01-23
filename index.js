const express = require("express");
const bodyParser = require("body-parser");
const keypadApi = require("./server/Keypad"); // Adjust the path as needed

const app = express();
const port = 3000; // Change this to your desired port

// Middleware for parsing JSON and URL-encoded form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Use the user API routes
app.use("/api/keypad", keypadApi);

app.get("/", (req, res) => {
  res.send("ok"); // Respond with a success status code
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
