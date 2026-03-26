const express = require('express');
const router = express.Router();
const FavouritesController = require('./../controllers/favourites-controller');
//const authMiddleware = require('../middleware/authMiddleware');

// any user can view the reviews page, but only logged in users can create reviews. Otherwise, redirect to login page

// router.get('/create', authMiddleware.isLoggedIn, FavouritesController.getFavouritesPage);

// router.post('/create', authMiddleware.isLoggedIn, FavouritesController.createFavouriteList);

// router.get('/users/:userId/update-favourites', authMiddleware.isLoggedIn, FavouritesController.getWatchList);
// router.post('/users/:userId/update-favourites', authMiddleware.isLoggedIn, FavouritesController.createFavouriteList);

// router.get('/users/:userId/favourites', authMiddleware.isLoggedIn, FavouritesController.getFavouritesPage);

// router.post('/users/:userId/favourites/:favouriteId/delete', authMiddleware.isLoggedIn, FavouritesController.removeFavourite);

router.get('/users/:userId/update-favourites',FavouritesController.getWatchList);
router.post('/users/:userId/update-favourites',FavouritesController.createFavouriteList);

router.get('/users/:userId/display-favourites-list',FavouritesController.getFavouritesPage);

router.post('/users/:userId/favourites/:favouriteId/delete',FavouritesController.removeFavourite);




module.exports = router;