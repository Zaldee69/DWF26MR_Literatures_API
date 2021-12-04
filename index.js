const express = require("express");
const cors = require("cors");
require("dotenv").config();
// Get routes to the variabel
const router = require("./src/routes");

const app = express();
app.use(express.json());

//CORS
app.use(cors());

//port
const port = 3500;

// Add endpoint grouping and router
app.use("/api/v1/", router);
app.use("/uploads", express.static("uploads"));

app.listen(port, () => console.log(`Listening on port ${port}`));
