const dotenv = require("dotenv").config({ path: `./config.env` });
const mongoose = require("mongoose");

const { readFileData } = require("./../../file");
const { Tour } = require("./../../models/tourModels/tourModel");

const DB = process.env.DATABASE.replace("<password>", process.env.PASSWORD);

async function connectDB() {
  try {
    await mongoose.connect(DB);
    console.log("DB connection successfull");
  } catch (error) {
    console.log(error);
  }
}

connectDB();

// Read-File

const tours = readFileData(`${__dirname}/tours.json`);

// Import data into DB

async function importData() {
  try {
    await Tour.create(tours);
    console.log("Data successfully loaded!");
  } catch (error) {
    console.log(error);
  }
  process.exit();
}

// Delete all data from collection

async function deleteData() {
  try {
    await Tour.deleteMany();
    console.log("Data successfully deleted!");
  } catch (error) {
    console.log(error);
  }
  process.exit();
}

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

console.log(process.argv);
