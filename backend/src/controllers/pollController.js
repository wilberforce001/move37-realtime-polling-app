import prisma from '../../src/prismaClient.js';
import jwt from "jsonwebtoken";

export async function createPoll(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { question, options, isPublished } = req.body;
    const poll = await prisma.poll.create({
      data: {
        question,
        isPublished: !!isPublished,
        creator: { connect: { id: userId } },
        options: { create: options.map(text => ({ text })) },
      },
      include: {
        options: {
          include: { _count: { select: { votes: true } } }
        },
        creator: { select: { id: true, name: true, email: true } }
      }
    });

    const pollWithCounts = {
      id: poll.id,
      question: poll.question,
      isPublished: poll.isPublished,
      createdAt: poll.createdAt,
      updatedAt: poll.updatedAt,
      creator: poll.creator,
      options: poll.options.map(o => ({
        id: o.id,
        text: o.text,
        votes: o._count.votes
      }))
    };
    return res.status(201).json(pollWithCounts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
}

export async function getPoll(req, res) {
  console.log("Incoming poll ID:", req.params.id);
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid poll ID' });
  }
  try {
    const poll = await prisma.poll.findUnique({
      where: { id },
      include: {
        options: {
          include: { _count: { select: { votes: true } } }
        },
        creator: { select: { id: true, name: true, email: true } }
      }
    });
    if (!poll) return res.status(404).json({ message: 'Not found' });

    poll.options = poll.options.map(o => ({
      id: o.id,
      text: o.text,
      votes: o._count.votes
    }));

    return res.json(poll);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
}

export async function listPolls(req, res) {
  try {
    const polls = await prisma.poll.findMany({
      include: {
        options: {
          include: { _count: { select: { votes: true } } }
        },
        creator: { select: { id: true, name: true, email: true } }
      }
    });

    const pollWithCounts = polls.map(poll => ({
      id: poll.id,
      question: poll.question,
      isPublished: poll.isPublished,
      createdAt: poll.createdAt,
      updatedAt: poll.updatedAt,
      creator: poll.creator,
      options: poll.options.map(o => ({
        id: o.id,
        text: o.text,
        votes: o._count.votes
      }))
    }));

    res.json(pollWithCounts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
}

export async function castVote(req, res) {
  const pollId = Number(req.params.id);
  const { optionId } = req.body;
  const io = req.app.get('io');

  try {
    // 🔐 extract user from token
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // validate option belongs to poll
    const option = await prisma.pollOption.findUnique({ where: { id: Number(optionId) } });
    if (!option || option.pollId !== pollId) {
      return res.status(400).json({ message: 'Option does not belong to poll' });
    }

    // upsert vote (unique compound key: userId + pollId)
    await prisma.vote.upsert({
      where: { userId_pollId: { userId, pollId } },
      update: { optionId: Number(optionId) },
      create: {
        userId,
        pollId,
        optionId: Number(optionId)
      }
    });

    // recompute counts
    const options = await prisma.pollOption.findMany({
      where: { pollId },
      include: { _count: { select: { votes: true } } }
    });

    const payload = options.map(o => ({
      id: o.id,
      text: o.text,
      votes: o._count.votes
    }));

    io.to(`poll_${pollId}`).emit('pollUpdated', { pollId, options: payload });

    return res.json({ success: true, options: payload });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
}

export async function updatePoll(req, res) {
  try {
    const id = Number(req.params.id);
    const { question, options, isPublished } = req.body;

    // 1. Check if poll exists
    const poll = await prisma.poll.findUnique({
      where: { id },
      include: { votes: true },
    });

    if (!poll) {
      return res.status(404).json({ message: "Poll not found" });
    }

    // 2. Check if poll already has votes
    const hasVotes = poll.votes.length > 0;

    let updatedPoll;

    if (hasVotes) {
      // 🚫 Block option editing, allow only question & isPublished
      updatedPoll = await prisma.poll.update({
        where: { id },
        data: {
          question,
          isPublished,
        },
        include: {
          options: true,
          votes: true,
          creator: { select: { id: true, name: true, email: true } },
        },
      });
    } else {
      // ✅ Safe to update question, isPublished, and options
      updatedPoll = await prisma.poll.update({
        where: { id },
        data: {
          question,
          isPublished,
          options: {
            deleteMany: {}, // clear old options
            create: options.map((text) => ({ text })),
          },
        },
        include: {
          options: true,
          votes: true,
          creator: { select: { id: true, name: true, email: true } },
        },
      });
    }

    res.json(updatedPoll);
  } catch (err) {
    console.error("Error updating poll:", err);
    res.status(500).json({ message: err.message });
  }
}

