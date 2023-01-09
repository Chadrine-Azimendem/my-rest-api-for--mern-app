// connect to the database cluster

// require the dotenv library
require("dotenv").config();

// require the mongoose library
const mongoose = require("mongoose");

// connect to mongodb database through the environment variable MONGO_URI
const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Successfully connected to the database");
  } catch (error) {
    console.log(error);
  }
};

// call connection function
dbConnection();
