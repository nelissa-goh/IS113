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

exports.deleteFavourites = function(favouriteId){
    return Favourite.deleteOne({ _id: favouriteId});
}

exports.updateFavouriteStatus = function(userId, movieId, isFavourite) {
  return Favourite.updateOne(
    { user: userId, "movieList.movie": movieId },
    { $set: { "movieList.$.isFavourite": isFavourite } }
  );
};

