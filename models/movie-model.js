const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A movie must have a title']
    },
    releaseYear: {
        type: String,
        required: [true, 'A movie must have a release year'],
    },
    category: {
        type: String,
        required: [true, 'A movie must have a category'],
    },
    synopsis: {
        type: String,
        required: [true, 'A movie must have a synopsis'],
    },
    runtime: {
        type: Number,
        required: [true, 'A movie must have a run time'],
    },
    director: {
        type: String,
        required: [true, 'A movie must have a director'],
    },
    image: {
        type: String,
        required: [true, 'A movie must have a image'],
    }
});

const Movie = mongoose.model('Movie', movieSchema,'movies');

//Methods here
exports.getAllMovies = function() {
    return Movie.find();
};

exports.searchByMovieTitle = function(title) {
    return Movie.findOne({title:title});
};

exports.addMovie = function(newMovie) {
    return Movie.create(newMovie);
};

exports.editMovie = function(title, editMovie) {
    return Movie.updateOne({title:title}, editMovie);
}

exports.deleteMovie = function(title) {
    return Movie.deleteOne({title:title});
}
