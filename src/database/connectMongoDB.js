const mongoose = require("mongoose");

async function connectMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("connected to mongodb");
  } catch (er) {
    console.log("ERROR connected database", er);
    process.exit(1);
  }
}

module.exports = connectMongoDB;
