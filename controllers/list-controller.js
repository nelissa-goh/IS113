const fs = require('fs/promises');

// const User = require('/../models/user-model');
const Movie = require('../models/movie-model');
const ListInfo = require('../models/movieList');

//watchlist to show personal watchlist 
exports.displayList = async (req,res) => {
  try {
    const user = req.params.userId;
    const listInfo = await ListInfo.findByUserId(user) 

    res.render('display-movies', {
      moviesList: listInfo ? listInfo.movieList.map(item=>item.movie) : [], 
      user 
    });
  } catch (error) {
    console.error(error)
  };
};

exports.createListInfo = async (req,res) => {
  try {
   
    let userId = req.session.userId;
    let email = req.session.email;
    let role = req.session.role;


    //retrieve selected movies
    let movies = req.query.selection || [];
    movies = Array.isArray(movies) ? movies : [movies];


    //Find or create customer
    let user = await User.searchByEmail(email);


    // if no user, direct to register page
    if (!user) {
      res.redirect('/register');
    };


    //making movieList
    const movieList = [];


    for (let movieId of movies) {
      const movie = await Movie.searchByMovieId(movieId);

      if(movie) {
        movieList.push({
          movie: movie._id,
          isWatched: false
        });
      };
    };


    //creating list info
    const newListInfo = {
      user : user._id,
      list : movieList
    };


    let listInfo = await ListInfo.createListInfo(newListInfo);


    res.render("success", {
      action: "created",
      affectedMovies: listInfo.movieList.map(m => m.movie), // pass movie IDs or titles
      userId: user._id
    });  


  } catch (error) {
    console.error(error)
    res.send("Error creating movie list.")
  };
};

exports.displayList = async (req,res) => {
  try {
    const user = req.params.userId;
    const listInfo = await ListInfo.findByUserId(user);

    res.render('display-movies', {
      moviesList: listInfo ? listInfo.movieList.map(item => item.movie) : [],
      user
    });
  } catch (error) {
    console.error(error);
  }
};


exports.showAddForm = async(req,res)=>{
  try{
    const user = req.params.userId;

    const allMovies = await Movie.find();
    const listInfo = await ListInfo.findByUserId(user);

    const selectedMovieIds = listInfo ? listInfo.movieList.map(item => item.movie._id.toString()): [];
    //if user has list it maps over and collects id of movie

    const remainingMovies = allMovies.filter(
      movie => !selectedMovieIds.includes(movie._id.toString())
    );
    //removes id of those already in selectedMovieids --> only those that are not added

    res.render('add-movies', {
      remainingMovies,
      selectedMovies: listInfo ? listInfo.movieList.map(item => item.movie) : []
    });

  }catch(error){
    console.error(error);
    res.send("Error adding movies to personal watch list")
  }
}

exports.addOrUpdateList = async (req, res) => {
  try {
    const userId = req.params.userId;
    const moviesToAdd = Array.isArray(req.body.movies)
      ? req.body.movies
      : [req.body.movies];

    let listInfo = await ListInfo.findByUserId(userId);

    if (!listInfo) {
      // Create new list if none exists
      listInfo = new ListInfo.ListInfo({ user: userId, movieList: [] });
      await listInfo.save();
    }

    // Use the model helper to push movies
    await ListInfo.addToList(listInfo._id, moviesToAdd);

    // Fetch updated list to render
    const updatedList = await findByUserId(userId);
    const movieDocs = await Movie.find({ _id: { $in: moviesToAdd } });

    res.render('success', {
      action: "added",
      affectedMovies: movieDocs.map(m => m.title),
      user: userId,
      listInfo: updatedList
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating movie list.");
  }
};

exports.showUpdateForm = async (req, res) => {
  try {
    const user = req.params.userId;
    const listInfo = await ListInfo.findByUserId(user) 
    res.render('update-status', {
      moviesList: listInfo ? listInfo.movieList : [],
      user
    });
  } catch (error) {
    console.error(error);
    res.send("Error showing update status form");
  }
};
// would provide updated list
exports.markWatched = async (req, res) => {
  try {
    const listId = req.params.listId;
    const movieId = req.body.movieId;
    const watched = req.body.watched === 'true' || req.body.watched === true; 
    // normalize to boolean

    // Load the list document
    let listInfo = await ListInfo.markWatched(listId, movieId, watched);

    if (listInfo) {
      // Update the one movie’s watched status
      listInfo.movieList.forEach(item => {
        if (item.movie.toString() === movieId) {
          item.isWatched = watched;
        }
      });
      await listInfo.save();
    }

    res.render('display-list', { listInfo });
  } catch (error) {
    console.error(error);
    res.send("Error updating movies watched.");
  }
};

exports.showDeleteForm = async(req,res)=>{
  try{;

    let user = req.params.userId;
    const listInfo = await ListInfo.findByUserId(user);

    const selectedMoviesNames = listInfo ? listInfo.movieList.map(item => item.movie) : [];

    res.render('delete-movies', {
      selectedMoviesNames
    });
  }catch(error){
    console.error(error);
    res.send("Error removing movies from personal watch list")
  }
}

exports.removeFromList = async(req, res) => {
  try {
  const user = req.params.userId;
  const moviesToRemove = Array.isArray(req.body.moviesToRemove) ? 
    req.body.moviesToRemove: [req.body.moviesToRemove];

  const listInfo = await ListInfo.removeFromList(listId, moviesToRemove);

  if(listInfo) {
    listInfo.movieList = listInfo.movieList.filter(item => !moviesToRemove.includes(item.movie.toString()));
    await listInfo.save();
  }
    res.render('success', {
      action: "removed",
      affectedMovies: moviesToRemove,
      user
    });
  } catch (error) {
    console.error(error)
  }  
};


//deletes the whole list (consider if need)
exports.deleteList = async(req,res) => {
  const listInfo = req.params.listId;

  try {
    let success = await ListInfo.deleteListInfo(listInfo);
    console.log(success);
    if (success.deletedCount === 1) {
      res.send("Movie List has been successfully deleted.");
    }
  } catch (error) {
    console.error(error);
  };

};