const WatchList = require('../models/watchlist-model');
const Movie = require('../models/movie-model');

//Display ALL watchlists for a user
exports.displayWatchLists = async (req, res) => {
    try {
        if(!req.session || !req.session.userId) {
            return res.redirect("/login");
        }

        const userId = req.session.userId;
        const watchLists = await WatchList.findByUserId(userId).populate("movieList.movie");

        res.render("watchlist-list", { watchLists : watchLists });

    } catch (error) {
        console.error(error);
        res.send("Error displaying all watchlists");
    }
};

//Display one specific watchlist for a user
exports.displayWatchList = async (req, res) => {
    try {
        const watchListId = req.params.watchListId;
        const watchList = await WatchList.findById(watchListId).populate("movieList.movie");
        res.render("watchlist", { watchList : watchList, 
        watchListId : watchList ? watchList._id : null});
    } catch (error) {
        console.error(error);
        res.send("Error displaying watchlist"); 
    }
};

exports.createWatchList = async (req, res) => {
    try {
        const userId = req.session.userId;
        const watchListName = req.body.watchListName;

        const newWatchList = {
            user: userId,
            watchListName: watchListName,
            movieList: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        const watchList = await WatchList.createWatchList(newWatchList);
        res.redirect("/watchlist");
    } catch (error) {
        console.error(error);
        res.send("Error creating watchlist");
    }
};

// Watchlist still exists even if you remove all movies
exports.removeFromWatchList = async (req, res) => {
    try {
        const watchListId = req.params.watchListId;
        const movieId = req.body.movieId;

        // Remove the movie from the watchlist
        await WatchList.removeFromWatchList(watchListId, movieId);

        // Render the page with the updated data
        res.redirect(`/watchlist/${watchListId}`);

    } catch (error) {
        console.error(error);
        res.send("Error removing movie from watchlist");
    }
};

exports.markWatched = async (req,res) => {
    try {
        const watchListId = req.params.watchListId;
        const movieId = req.body.movieId;
        const watched = req.body.watched === "true";

        await WatchList.markWatched(watchListId, movieId, watched);

        res.redirect(`/watchlist/${watchListId}`);

    } catch (error) {
        console.error(error);
        res.send("Error updating watched status");
    }
};

exports.deleteWatchList = async (req, res) => {
    try {
        const watchListId = req.params.watchListId;
        await WatchList.deleteWatchList(watchListId);
        res.redirect("/watchlist");
    } catch (error) {
        console.error(error);
        res.send("Error deleting watchlist");
    }
};

exports.displayAddForm = async (req, res) => {
    try {
        const movies = await Movie.getAllMovies();
        const watchListId = req.params.watchListId;
        res.render("add-to-watchlist", { watchListId, movies });
    } catch (error) {
        console.error(error);
        res.send("Error displaying add to watchlist form");
    }
};

exports.addToWatchList = async (req, res) => {
    try {
        const watchListId = req.params.watchListId;
        let moviesToAdd = req.body.movieIds;
        
        if (!Array.isArray(moviesToAdd)) {
            moviesToAdd = [moviesToAdd];
        }

        await WatchList.addToWatchList(watchListId, moviesToAdd);

        res.redirect(`/watchlist/${watchListId}`);
    } catch (error) {
        console.error(error);
        res.send("Error adding movie to watchlist");
    }
};