const mongoose = require('mongoose');

// Create a new ‘favourites' schema
const favouriteSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    movieList: [{
        movie: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Movie',
            required: true
        },
        isFavourite: {
            type: Boolean,
            required: true,
            default: false
        },
        dateAdded: {
            type: Date,
            default: Date.now
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

const Favourite = mongoose.model('Favourite', favouriteSchema,'favourite');

//Methods here

exports.Favourite = Favourite;

exports.retrieveAll = function() {
  return Favourite.find().populate('movieList.movie');
};

exports.addFavourites = function(newFavourite){
    return Favourite.create(newFavourite);
};

exports.updateFavouriteStatus = function(userId, movieId, isFavourite) {
  return Favourite.updateOne(
    { user: userId, "movieList.movie": movieId },
    { $set: { "movieList.$.isFavourite": isFavourite, "movieList.$.dateAdded": new Date() } }
  );
};

exports.removeMovieFromFavourites = function(userId, movieId) {
  return Favourite.updateOne(
    { user: userId },
    { $pull: { "movieList": { movie: movieId } } }
  );
};
