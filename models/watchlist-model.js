const mongoose = require("mongoose");

const watchListSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  movieList: [{
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie"
    },
    isWatched: {
      type: Boolean,
      default: false
    }
  }],

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const WatchList = mongoose.model("WatchList", watchListSchema);

//methods for watchlist
exports.findByUserId = function(userId) {
  return WatchList.findOne({ user: userId });
};

exports.createWatchList = function(newWatchList) {
  return WatchList.create(newWatchList);
};  

exports.markWatched = function(listId, movieId, isWatched) {
  return WatchList.updateOne(
    { _id: listId, 'watchList.movie': movieId },
    { $set: { 'watchList.$.isWatched': isWatched } }
  );
};

exports.deleteWatchList = function(listId) {
  return WatchList.deleteOne({ _id: listId });
};

exports.addToWatchList = function (listId, moviesToAdd) {
    const watchList = moviesToAdd.map(movieId => ({
        movie: movieId,
        isWatched: false
    }));
    return WatchList.updateOne({ _id : listId}, {$push: {watchList: {$each : watchList}}});
};   