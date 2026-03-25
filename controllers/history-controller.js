const History = require("../models/history-model");

exports.showHistory = async (req, res) => {
  try {
    const historyList = await History.getAllHistory();
    res.render("movie-history", { historyList });
  } catch (err) {
    console.error(err);
    res.send("Error loading history");
  }
};
