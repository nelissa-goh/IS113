const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true
  },
  reviewerName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Review = mongoose.model("Review", reviewSchema, "reviews");

// Methods here
exports.findReviewsByMovieId = function(movieId) {
  return Review.find({ movieId: movieId });
};
//create
exports.addReview = function(newReview) {
  return Review.create(newReview);
};
//read
exports.findReviewById = function(reviewId) {
  return Review.findById(reviewId);
};
//update
exports.updateReviewById = function(reviewId, updatedReview) {
  return Review.findByIdAndUpdate(reviewId, updatedReview, { new: true });
};
//delete
exports.deleteReviewById = function(reviewId) {
  return Review.findByIdAndDelete(reviewId);
};