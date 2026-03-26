
const Review = require("../models/reviews-model");

// Retrieves all reviews for specific movie and renders the review list page, read

exports.getReviewsByMovie = async (req, res) => {
  try {
    //fetch reviews form the model using movieID from URL
    const reviews = await Review.findReviewsByMovieId(req.params.movieId);
    //render reviews page
    res.render("reviews-list", { reviews, movieId: req.params.movieId });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading reviews");
  }
};
//displays the form for adding a new review
exports.showAddReviewForm = (req, res) => {
  res.render("add-review", { movieId: req.params.movieId });
};

//handles submission of new review and save it to database, create
exports.addReview = async (req, res) => {
  try {
    //construct review object from form input
    const newReview = {
      movieId: req.params.movieId,
      reviewerName: req.body.reviewerName,
      rating: req.body.rating,
      comment: req.body.comment
    };
    //basic validation, ensuring all fields are filled
    if (!newReview.reviewerName || !newReview.rating || !newReview.comment) {
      return res.send("All fields are required");
    }
    //validate rating range
    if (newReview.rating < 1 || newReview.rating > 5) {
      return res.send("Rating must be between 1 and 5");
    }
    //save review 
    await Review.addReview(newReview);

    await History.addHistory({
      title: req.params.movieId, 
      action: "ADD",
      type: "REVIEW",
      details: "New review added"
    });
    
    res.redirect(`/reviews/movie/${req.params.movieId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding review");
  }
};
//loads edit form, edit
exports.showEditReviewForm = async (req, res) => {
  try {
    //retrieve existing review
    const review = await Review.findReviewById(req.params.reviewId);
    //if review does not exist, return error
    if (!review) {
      return res.status(404).send("Review not found");
    }

    res.render("edit-review", { review });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading edit form");
  }
};


//updates an existing review in database
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

    await History.addHistory({
      title: req.params.movieId,
      action: "EDIT",
      type: "REVIEW",
      details: "Review updated"
    });
    
    res.redirect(`/reviews/movie/${existingReview.movieId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating review");
  }
};
//delete review from database
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findReviewById(req.params.reviewId);

    if (!review) {
      return res.status(404).send("Review not found");
    }

    await Review.deleteReviewById(req.params.reviewId);

    await History.addHistory({
      title: req.params.movieId,
      action: "DELETE",
      type: "REVIEW",
      details: "Review deleted"
    });
    
    res.redirect(`/reviews/movie/${review.movieId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting review");
  }
};
