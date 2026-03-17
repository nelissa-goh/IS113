const Movie = require('./../models/movie-model');

exports.showMovies = async (req, res) => {
  try {
    let movieList = await Movie.getAllMovies();
    res.render("display-movies", {movieList});
  } catch (error) {
    console.error(error);
    res.send("Error reading database");
  }
};

exports.searchForm = async (req, res) => {
  let result = "";
  res.render("search-movie", {result});
};

exports.searchMovie = async (req, res) => {
  const title = req.body.title;

  if (!title) {
    res.redirect("/search-movie");
    return;
  }

  try {
    let result = await Movie.searchByMovieTitle(title);
    res.render("search-movie", {result:result || null});
  } catch (error) {
    console.error(error);
  }
};

exports.addForm = async (req, res) => {
  let result = "";
  res.render("add-movie", {result});
};

exports.addMovie = async (req, res) => {
  const title = req.body.title;
  const releaseYear = req.body.releaseYear;
  const category = req.body.category;
  const synopsis = req.body.synopsis;
  const runtime = req.body.runtime;
  const director = req.body.director;
  const image = req.body.image;

  let newMovie = {
    title: title,
    releaseYear: releaseYear,
    category: category,
    synopsis: synopsis,
    runtime: runtime,
    director: director,
    image: image
  };

  try {
    let msg = "";
    if (!title || !releaseYear || !category || !synopsis || !runtime || !director || !image) {
      let result = "empty";
      msg = "All fields are required";
      return res.render("add-movie", {result, msg});
    }
    let existingMovie = await Movie.searchByMovieTitle(title);
    if (existingMovie) {
      let result = "error";
      msg = "Error adding movie";
      return res.render("add-movie", {result, msg});
    }
    let result = await Movie.addMovie(newMovie);
    res.render("add-movie", {result:result || null, msg});
  } catch (error) {
    console.error(error);
    let result = "fail";
    let msg = "";
    res.render("add-movie", {result, msg});
  }
};

exports.editForm = async (req, res) => {
  const title = req.query.title;

  if (!title) {
    res.redirect("/display-movies");
    return;
  }

  try {
    let result = await Movie.searchByMovieTitle(title);
    res.render("edit-movie", {result:result || null});
  } catch (error) {
    console.error(error);
  }
};

exports.editMovie = async (req, res) => {
  const title = req.body.title;
  const releaseYear = req.body.releaseYear;
  const category = req.body.category;
  const synopsis = req.body.synopsis;
  const runtime = req.body.runtime;
  const director = req.body.director;
  const image = req.body.image;

  let editMovie = {
    releaseYear: releaseYear,
    category: category,
    synopsis: synopsis,
    runtime: runtime,
    director: director,
    image: image
  };

  try {
    let success = await Movie.editMovie(title, editMovie);
    console.log(success);
    res.send("Movie has been successfully updated.");
  } catch (error) {
    console.error(error);
  }
};

exports.deleteForm = async (req, res) => {
  const title = req.query.title;

  if (!title) {
    res.redirect("/display-movies");
    return;
  }

  try {
    let result = await Movie.searchByMovieTitle(title);
    res.render("delete-movie", {result:result || null});
  } catch (error) {
    console.error(error);
  }
};

exports.deleteMovie = async (req, res) => {
  const title = req.body.title;
  
  try {
    let success = await Movie.deleteMovie(title);
    console.log(success);
    if (success.deletedCount === 1) {
      res.send("Movie has been successfully deleted.");
    }
  } catch (error) {
    console.error(error);
  }
};
