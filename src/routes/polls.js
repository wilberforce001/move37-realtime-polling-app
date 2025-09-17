import { Router } from 'express';
const router = Router();
import { createPoll, getPoll, castVote, listPolls} from '../controllers/pollController.js';
import prisma from '../prismaClient.js';
import { io } from '../index.js';
import { isAdmin } from '../controllers/userController.js';
import { authenticate } from '../middleware/authMiddleware.js';

router.post('/', authenticate, isAdmin, createPoll); // create poll + options
router.get('/', listPolls); // list all polls
router.get('/:id', getPoll); // get poll with options + counts

router.post("/:id/vote", async (req, res) => {
  try {
    console.log("Incoming vote request:", req.params, req.body);
    const { id } = req.params;
    const { optionId } = req.body;

    if (!optionId) {
      return res.status(400).json({ error: "optionId is required" });
    }

    // find poll
    const poll = await prisma.poll.findUnique({
      where: { id: parseInt(id) },
      include: { options: true }
    });

    if (!poll) {
      return res.status(404).json({ error: "Poll not found" });
    }

    // create a new vote for this option
    await prisma.vote.create({
      data: {
        option: { connect: { id: Number(optionId) } },
        poll: { connect: { id: parseInt(id) } },
        // if you have user authentication:
        // user: { connect: { id: req.user.id } }
      }
    });

    // re-fetch updated option counts
    const options = await prisma.pollOption.findMany({
      where: { pollId: parseInt(id) },
      include: { _count: { select: { votes: true } } }
    });

    io.emit("pollUpdated", {
      pollId: parseInt(id),
      options: options.map(o => ({
        id: o.id,
        text: o.text,
        votes: o._count.votes
      })),
    });

    res.json({
      success: true,
      options: options.map(o => ({
        id: o.id,
        text: o.text,
        votes: o._count.votes
      })),
    });

  } catch (err) {
    console.error("Vote error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});


export default router;
