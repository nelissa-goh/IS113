
const Review = require("../models/reviews-model");

exports.getReviewsByMovie = async (req, res) => {
  try {
    const reviews = await Review.findReviewsByMovieId(req.params.movieId);
    res.render("reviews-list", { reviews, movieId: req.params.movieId });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading reviews");
  }
};

exports.showAddReviewForm = (req, res) => {
  res.render("add-review", { movieId: req.params.movieId });
};

exports.addReview = async (req, res) => {
  try {
    const newReview = {
      movieId: req.params.movieId,
      reviewerName: req.body.reviewerName,
      rating: req.body.rating,
      comment: req.body.comment
    };

    if (!newReview.reviewerName || !newReview.rating || !newReview.comment) {
      return res.send("All fields are required");
    }

    if (newReview.rating < 1 || newReview.rating > 5) {
      return res.send("Rating must be between 1 and 5");
    }

    await Review.addReview(newReview);
    res.redirect(`/reviews/movie/${req.params.movieId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding review");
  }
};

exports.showEditReviewForm = async (req, res) => {
  try {
    const review = await Review.findReviewById(req.params.reviewId);

    if (!review) {
      return res.status(404).send("Review not found");
    }

    res.render("edit-review", { review });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading edit form");
  }
};

exports.updateReview = async (req, res) => {
  try {
    const updatedReview = {
      reviewerName: req.body.reviewerName,
      rating: req.body.rating,
      comment: req.body.comment
    };

    if (!updatedReview.reviewerName || !updatedReview.rating || !updatedReview.comment) {
      return res.send("All fields are required");
    }

    if (updatedReview.rating < 1 || updatedReview.rating > 5) {
      return res.send("Rating must be between 1 and 5");
    }

    const existingReview = await Review.findReviewById(req.params.reviewId);

    if (!existingReview) {
      return res.status(404).send("Review not found");
    }

    await Review.updateReviewById(req.params.reviewId, updatedReview);
    res.redirect(`/reviews/movie/${existingReview.movieId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating review");
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findReviewById(req.params.reviewId);

    if (!review) {
      return res.status(404).send("Review not found");
    }

    await Review.deleteReviewById(req.params.reviewId);
    res.redirect(`/reviews/movie/${review.movieId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting review");
  }
};