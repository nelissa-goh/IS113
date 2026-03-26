const Favourite = require('./../models/favourites-model');
//const User = require ('./../models/User')

exports.getWatchList = async (req, res) => {
  try {
    const favourites = await Favourite.retrieveAll();
    const userFav = favourites.find(f => f.user.toString() === req.session.userId);

    res.render('update-favourites', {
      moviesList: userFav ? userFav.movieList : [],
      user: req.params.userId
    });
  } catch (error) {
    console.error(error)
    res.send("Error getting watch list")
  }
};


exports.createFavouriteList = async (req,res) =>{
    try {
        const userId = req.params.userId;
        // let email = req.session.email;
        // let role = req.session.role;

        const selectedMovies= req.query.favourite || [];
        const selectedArray = Array.isArray(selectedMovies)? selectedMovies: [selectedMovies];

    // Load existing favourites
    // Try to find an existing favourites document
        // Get all favourites from the database
        let allFavourites = await retrieveAll();
        let favourites = null;

        for (let f of allFavourites) {
            if (f.user.toString() === userId) {
                favourites = f;
                break; 
            }
        }

    if (!favourites) {
      // If none exists, create a new one using addFavourites
      favourites = await Favourite.addFavourites({
        user: userId,
        movieList: selectedArray.map(movieId => ({
          movie: movieId,
          isFavourite: true
        }))
      });
    } else {
      // Update existing favourites
      favourites.movieList.forEach(entry => {
        entry.isFavourite = selectedArray.includes(entry.movie._id.toString());
      });
      await favourites.save();
    }

    res.render('favourite-success', {
      favourites: favourites.movieList.filter(m => m.isFavourite),
      userId
    });

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
      user: req.params.userId
    });
  } catch (error) {
    console.error(error);
    res.send("Error loading page.")
  }
};

// Remove a favourite by ID
exports.removeFavourite = async (req, res) => {
  try {
    const favouriteId = req.params.favouriteId;
    await deleteFavourites(favouriteId);
    res.redirect(`/users/${req.params.userId}/favourites`);
  } catch (error) {
    console.error(error)
    res.send("Error removing movie from favourites.")
  }
};

