const mongoose = require("mongoose");

const watchListSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  watchListName: {
    type: String,
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

//find ALL watchlists for a user
exports.findByUserId = function(userId) {
  return WatchList.find({ user: userId });
};

// Find ONE specific watchlist by its ID
exports.findById = function(watchListId) {
    return WatchList.findById(watchListId);
};

exports.createWatchList = function(newWatchList) {
  return WatchList.create(newWatchList);
};  

exports.markWatched = function(watchListId, movieId, isWatched) {
  return WatchList.updateOne(
    { _id: watchListId, 'movieList.movie': movieId },
    { $set: { 'movieList.$.isWatched': isWatched, updatedAt: Date.now() } }
  );
};

exports.deleteWatchList = function(watchListId) {
  return WatchList.deleteOne({ _id: watchListId });
};

exports.addToWatchList = function (watchListId, moviesToAdd) {
    const movies = moviesToAdd.map(movieId => ({
        movie: movieId,
        isWatched: false
    }));
    return WatchList.updateOne({ _id : watchListId}, 
        {$push: {movieList: {$each : movies}}, $set: {updatedAt: Date.now()}});
};   

exports.removeFromWatchList = function(watchListId, movieId) {
    return WatchList.updateOne({ _id : watchListId}, 
        {$pull: {movieList: {movie : movieId }}, $set: {updatedAt: Date.now()}});
};