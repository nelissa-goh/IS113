const express = require('express');
const router = express.Router();
const watchListController = require('../controllers/watchlist-controller');

//Display all watchlists for a user
router.get('/watchlist', watchListController.displayWatchLists);

//Create new watchlist
router.post('/watchlist/create', watchListController.createWatchList);

//Display one specific watchlist for a user
router.get('/watchlist/:watchListId', watchListController.displayWatchList);

//Delete a watchlist
router.post('/watchlist/:watchListId/delete', watchListController.deleteWatchList);

//Mark movie as watched/unwatched
router.post('/watchlist/:watchListId/mark-watched', watchListController.markWatched);

//Remove movie from watchlist
router.post('/watchlist/:watchListId/remove', watchListController.removeFromWatchList);

//Add movie to watchlist
router.get('/watchlist/:watchListId/add', watchListController.displayAddForm);
router.post('/watchlist/:watchListId/add', watchListController.addToWatchList);

module.exports = router;