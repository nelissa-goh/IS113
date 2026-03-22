
//imports review model so controller can interact with reviews collection in MongoDB
const Review = require("../models/reviews-model");


//retrieves all reviews for a particular movie and retrieves them
exports.getReviewsByMovie = async (req, res) => {
  const reviews = await Review.find({ movieId: req.params.movieId });
  res.render("reviews-list", { reviews, movieId: req.params.movieId });
};
//displays page where user can add one more review
exports.showAddReviewForm = (req, res) => {
  res.render("add-review", { movieId: req.params.movieId });
};

exports.addReview = async (req, res) => {
  const { reviewerName, rating, comment } = req.body;
//check if any field is empty. If empty, function stops and send error message.
  if (!reviewerName || !rating || !comment) {
    return res.send("All fields required");
  }

  await Review.create({
    movieId: req.params.movieId,
    reviewerName,
    rating,
    comment
  });

  res.redirect(`/reviews/movie/${req.params.movieId}`);
};
//deletes one review from MongoDB
exports.deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.reviewId);
  await Review.findByIdAndDelete(req.params.reviewId);
  res.redirect(`/reviews/movie/${review.movieId}`);
};