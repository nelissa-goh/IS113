const express = require('express');

const listController = require('../controllers/list-controller');

const router = express.Router(); // sub application
//create new watchlist
router.post('/users/:userId/createlist', listController.createListInfo);

//display watch list
router.get('/users/:userId/watchlist', listController.displayList);

//add movies
router.get('/users/:userId/add-movies', listController.showAddForm);
router.post('/users/:userId/add-movies', listController.addOrUpdateList);

//update watched status
router.get("/users/:userId/update-status", listController.showUpdateForm);
router.post('/users/:userId/update-status', listController.markWatched);

//delete movies
router.get('/users/:userId/delete-movies', listController.showDeleteForm);
router.post('/users/:userId/delete-movies', listController.removeFromList);

// Delete entire list (optional)
// router.post('/users/:userId/delete-list', listController.deleteList);

// EXPORT
module.exports = router;
