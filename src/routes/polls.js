const express = require('express');
const router = express.Router();
const controller = require('../controllers/pollController');

router.post('/', controller.createPoll); 
router.get('/:id', controller.getPoll);
router.post('/:id/vote', controller.castVote);

module.exports = router;
