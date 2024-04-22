const mongoose = require("mongoose");
mongoose.set('strictQuery', true);

const connectMongoDb = async (uri) => {
  return mongoose
  .connect(uri)
  .then(() => console.log("MongoDB Connected successfully"))
  .catch((err) => console.log("MongoDB Error", err))
}

const db = mongoose.connection;

module.exports = {
  db,
  connectMongoDb,
}