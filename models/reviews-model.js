
// imports mongoose
const mongoose = require("mongoose");
//creates schema for review
const reviewSchema = new mongoose.Schema({
  //stores ID of movie, ID: Movie, every review must belong to movie
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true
  },
  // stores reviewer name
  reviewerName: {
    type: String,
    required: true
  },
  //compulsory rating for every review, from 1-5
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  //stores reviewers comment, cannot be empty
  comment: {
    type: String,
    required: true
  },
  //stores date/time when review was being created
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Review", reviewSchema);