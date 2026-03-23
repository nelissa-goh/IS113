
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




// Show edit form for one review
exports.showEditReviewForm = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return res.status(404).send("Review not found");
    }
    res.render("edit-review", { review });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading edit form");
  }
};

// Update one review
exports.updateReview = async (req, res) => {
  try {
    const { reviewerName, rating, comment } = req.body;
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return res.status(404).send("Review not found");
    }
    if (!reviewerName || !rating || !comment) {
      return res.send("All fields are required");
    }
    if (rating < 1 || rating > 5) {
      return res.send("Rating must be between 1 and 5");
    }
    review.reviewerName = reviewerName;
    review.rating = rating;
    review.comment = comment;
    await review.save();
    res.redirect(`/reviews/movie/${review.movieId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating review");
  }
};