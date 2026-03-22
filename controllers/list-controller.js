const fs = require('fs/promises');

// const User = require('./../models/user-model');
const Movie = require('./../models/movie-model');
const ListInfo = require('./../models/movieList');

//watchlist to show personal watchlist 
exports.displayList = async (req,res) => {
  try {
    const user = req.params.userId;
    const listInfo = await ListInfo.findOne({ user: req.params.userId}) 
      .populate('movieList.movie') 
    res.render('display-movies', {
      moviesList: listInfo ? listInfo.movieList.map(item=>item.movie) : [], 
      user 
    });
  } catch (error) {
    console.error(error)
  };
};

exports.showAddForm = async(req,res)=>{
  try{
    const userId = req.params.userId;

    const allMovies = await Movie.find();
    const listInfo = await ListInfo.findOne({user: userId}).populate('movieList.movie');

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
    const moviesToAdd = Array.isArray(req.body.movies) ? req.body.movies : [req.body.movies];

    let listInfo = await ListInfo.findOne({ user: userId });
    //find document where user field equals this userId

    if (!listInfo) {
      // Create new list if none exists
      listInfo = new ListInfo({ user: userId, movieList: [] });
    }

    for (const movieId of moviesToAdd) {
      const alreadyInList = listInfo.movieList.some(
        entry => entry.movie.toString() === movieId
      );

      if (!alreadyInList) {
        listInfo.movieList.push({ movie: movieId, isWatched: false });
      }
    }
    //check if movie is in list already

    await listInfo.save();
    const movieDocs = await Movie.find({ _id: { $in: moviesToAdd } });

    res.render('success', {
      action: "added",
      affectedMovies: movieDocs.map(m => m.title),
      userId
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating movie list.");
  }
};

exports.showUpdateForm = async (req, res) => {
  try {
    const userId = req.params.userId;
    const listInfo = await ListInfo.findOne({ user: userId }).populate('movieList.movie');
    res.render('update-status', {
      moviesList: listInfo ? listInfo.movieList : [],
      userId
    });
  } catch (error) {
    console.error(error);
    res.send("Error showing update status form");
  }
};
// can submit all the checked movies
exports.updateStatus = async(req,res)=>{
  try {
    const user = req.params.userId;
    const watchedMovies = Array.isArray(req.body.watched) ? req.body.watched : [req.body.watched];

    const listInfo = await ListInfo.findOne({ user });

    if (listInfo) {
      listInfo.movieList.forEach(item => {
        item.isWatched = watchedMovies.includes(item.movie.toString());
      });
      await listInfo.save();
    }
    const movieDocs = await Movie.find({ _id: { $in: watchedMovies } });
//finds for the movies whose _id was selected
    res.render('success', {
      action: "updated status",
      affectedMovies: movieDocs.map(m => m.title),
      //takes each movie object and returns its title
      user
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating status");
  }
};

exports.showDeleteForm = async(req,res)=>{
  try{
    const listInfo = await ListInfo.findById(req.params.listId);

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

  const listInfo = await ListInfo.findOne({ user });

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