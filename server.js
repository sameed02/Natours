const dotenv = require("dotenv").config({ path: "./config.env" });
const mongoose = require("mongoose");
const { app } = require("./app");

const DB = process.env.DATABASE.replace("<password>", process.env.PASSWORD);

console.log(`environment = ${process.env.NODE_ENV}`);

async function connectDB() {
  try {
    await mongoose.connect(DB);
    console.log("DB connection successfull");
  } catch (error) {
    console.log(error);
  }
}

connectDB();

app.listen(process.env.PORT, () =>
  console.log(`app is listening on port 3000`)
);
