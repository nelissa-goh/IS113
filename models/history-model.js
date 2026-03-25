const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  title: String,
  action: String, // ADD, EDIT, DELETE
  timestamp: {
    type: Date,
    default: Date.now
  },
  details: String
});

const History = mongoose.model("History", historySchema, "history");

//Methods
exports.addHistory = async (data) => {
  return await History.create(data);
};

exports.getAllHistory = async () => {
  return await History.find().sort({ timestamp: -1 });
};
