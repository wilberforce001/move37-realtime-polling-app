import { Router } from 'express';
const router = Router();
import { createPoll, getPoll, castVote, listPolls} from '../controllers/pollController.js';

router.post('/', createPoll); // create poll + options
router.get('/', listPolls); // list all polls
router.get('/:id', getPoll); // get poll with options + counts
router.post('/:id/vote', castVote); // submit (or change) vote

export default router;
