import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 3000;

// // Routes
// app.use("/api");
app.get("/", (req, res) => {
  res.send("Welcome to the Telemedicine Platform !");
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
