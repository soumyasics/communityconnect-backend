const mongoose = require("mongoose");
const MONGO_DB_URL = "mongodb://127.0.0.1:27017/community";
mongoose.connect(MONGO_DB_URL);
var db = mongoose.connection;
db.on("error", console.error.bind("error"));
db.once("open", function () {
  console.log("connection successful");
});

module.exports = db;  
