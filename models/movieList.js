//unique to users
const mongoose = require('mongoose');

const listInfoSchema = new mongoose.Schema({
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
        isWatched: {
            type: Boolean,
            required: true,
            default: false
        }
    }]
});

const ListInfo = mongoose.model('ListInfo', listInfoSchema);

// exports.ListInfo = ListInfo;

exports.findByUserId = function(userId) {
  return ListInfo.findOne({ user: userId }).populate('movieList.movie');
};

exports.createListInfo = function(newListInfo) {
  return ListInfo.create(newListInfo);
};

exports.markWatched = function(listId, movieId, isWatched) {
  return ListInfo.updateOne(
    { _id: listId, 'movieList.movie': movieId },
    { $set: { 'movieList.$.isWatched': isWatched } }
  );
};

exports.deleteListInfo = function(listId) {
  return ListInfo.deleteOne({ _id: listId });
};
