const Favourite = require('./../models/favourites-model');
//const User = require ('./../models/User')

exports.getWatchList = async (req, res) => {
  try {
    const userId = req.params.userId;
    const favourites = await Favourite.retrieveAll();
    const userFav = favourites.find(f => f.user.toString() === userId);

    res.render('update-favourites', {
      moviesList: userFav ? userFav.movieList : [],
      user: userId
    });
  } catch (error) {
    console.error(error)
    res.send("Error getting watch list")
  }
};


exports.createFavouriteList = async (req, res) => {
    try {
        const userId = req.params.userId;
        const selectedMovies = req.body.favourite || [];
        const selectedArray = Array.isArray(selectedMovies) ? selectedMovies : [selectedMovies];

        // Get all favourites from the database
        let allFavourites = await Favourite.retrieveAll();
        let favourites = null;

        for (let f of allFavourites) {
            if (f.user.toString() === userId) {
                favourites = f;
                break; 
            }
        }

        // Track newly added movies
        let newlyAddedMovies = [];

        if (!favourites) {
            // If none exists, create a new one
            favourites = await Favourite.addFavourites({
                user: userId,
                movieList: selectedArray.map(movieId => ({
                    movie: movieId,
                    isFavourite: true,
                    dateAdded: new Date()
                }))
            });
            // Populate the newly created document
            favourites = await Favourite.Favourite.findById(favourites._id).populate('movieList.movie');
            newlyAddedMovies = favourites.movieList.filter(m => m.isFavourite);
        } else {
            // Update existing favourites and track newly added movies
            const previousFavourites = new Set(
                favourites.movieList
                    .filter(m => m.isFavourite)
                    .map(m => m.movie._id.toString())
            );

            favourites.movieList.forEach(entry => {
                const isSelected = selectedArray.includes(entry.movie._id.toString());
                const wasAlreadyFavourite = previousFavourites.has(entry.movie._id.toString());
                
                entry.isFavourite = isSelected;
                
                // Update dateAdded if newly marked as favourite
                if (isSelected && !wasAlreadyFavourite) {
                    entry.dateAdded = new Date();
                }
            });

            await favourites.save();

            // Get newly added movies
            newlyAddedMovies = favourites.movieList.filter(m => {
                const isNowFavourite = selectedArray.includes(m.movie._id.toString());
                const wasNotFavouriteBefore = !previousFavourites.has(m.movie._id.toString());
                return isNowFavourite && wasNotFavouriteBefore;
            });
        }

        // Redirect with success message and newly added movies
        const movieTitles = newlyAddedMovies.map(m => m.movie.title).join(', ');
        res.redirect(`/users/${userId}/display-favourites-list?added=true&newMovies=${encodeURIComponent(movieTitles)}`);

    } catch (error) {
        console.error(error)
        res.send("Error creating favourites list")
    }
};


exports.getFavouritesPage = async(req,res) =>{
  try {
    const favourites = await Favourite.retrieveAll();
    const userFav = favourites.find(f => f.user.toString() === req.params.userId);

    res.render('display-favourites-list', {
      moviesList: userFav ? userFav.movieList.filter(m => m.isFavourite) : [],
      user: req.params.userId,
      added: req.query.added === 'true',
      newMovies: req.query.newMovies || '',
      removed: req.query.removed === 'true',
      removedMovie: req.query.movieTitle || ''
    });
  } catch (error) {
    console.error(error);
    res.send("Error loading page.")
  }
};

// Remove a favourite by movie ID
exports.removeFavourite = async (req, res) => {
  try {    
    const userId = req.params.userId;
    const movieId = req.params.movieId;
    const movieTitle = req.query.title || 'Movie';

    // Remove the movie from the user's favourites
    await Favourite.removeMovieFromFavourites(userId, movieId);

    // Redirect to display favourites with a success message
    res.redirect(`/users/${userId}/display-favourites-list?removed=true&movieTitle=${movieTitle}`);
  } catch (error) {
    console.error(error)
    res.send("Error removing movie from favourites.")
  }
};

