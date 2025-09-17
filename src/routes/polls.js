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

// DELETE poll by id (only admin)
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const pollId = Number(req.params.id);

    // Ensure poll exists
    const poll = await prisma.poll.findUnique({ where: { id: pollId } });
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    // Optionally restrict to creator only
    if (poll.creatorId !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own polls" });
    }

    // 1. Delete votes linked to poll options (if you have a Vote model)
    await prisma.vote.deleteMany({
      where: { option: { pollId } },
    });

    // 2. Delete poll options first
    await prisma.pollOption.deleteMany({
      where: { pollId },
    });

    // 3. Delete the poll itself
    await prisma.poll.delete({
      where: { id: pollId },
    });

    res.json({ message: "Poll and its options deleted successfully" });
  } catch (err) {
    console.error("Delete poll error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
});


export default router;
