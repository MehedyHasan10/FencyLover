const mongoose = require("mongoose");
const { mongodbURL } = require("../secret");

const connectDataBase = async (options = {}) => {
  try {
    // Connection related code
    await mongoose.connect(mongodbURL, options);
    console.log('Connection with MongoDB successful...');

    // Listen for connection errors
    mongoose.connection.on('error', (error) => {
      console.error('DB connection error:', error);
    });
  } catch (error) {
    console.error('Could not connect to DB:', error.toString());
  }
};

module.exports = connectDataBase;


