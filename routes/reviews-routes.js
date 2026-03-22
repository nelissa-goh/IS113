const express = require("express");
const router = express.Router();
const reviewsController = require("../controllers/reviews-controller");

//view all reviews for a specific movie
router.get("/movie/:movieId", reviewsController.getReviewsByMovie);

//show add review form for a specific movie
router.get("/add/:movieId", reviewsController.showAddReviewForm);

//Handles the submitted review form and creates a review.
router.post("/add/:movieId", reviewsController.addReview);

//Handles deleting a review by its ID.
router.post("/delete/:reviewId", reviewsController.deleteReview);

module.exports = router;