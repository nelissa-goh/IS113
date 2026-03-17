const express = require('express');
const router = express.Router();
const moviesController = require('./../controllers/movies-controller');

router.get("/movies", moviesController.showMovies);

router.get("/search-movie", moviesController.searchForm);
router.post("/search-movie", moviesController.searchMovie);

router.get("/add-movie", moviesController.addForm);
router.post("/add-movie", moviesController.addMovie);

router.get("/edit-movie", moviesController.editForm);
router.post("/edit-movie", moviesController.editMovie);

router.get("/delete-movie", moviesController.deleteForm);
router.post("/delete-movie", moviesController.deleteMovie);

module.exports = router;
