import { text } from 'express';
import prisma from '../prismaClient.js';

export async function createPoll(req, res) {
  try {
    const { question, options, creatorId, isPublished } = req.body;
    const poll = await prisma.poll.create({
      data: {
        question,
        isPublished: !!isPublished,
        creator: { connect: { id: creatorId } },
        options: { create: options.map(text => ({ text })) },
      },
      include: {
        options: {
          include: {
            _count: { select: { votes: true }}
          }
        },
        creator: { select: { id: true, name: true, email: true }}
      }
    });

    // shape options with vote counts
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
  const id = Number(req.params.id);
  try {
    const poll = await prisma.poll.findUnique({
      where: { id },
      include: {
        options: {
          include: {
            _count: { select: { votes: true } }
          }
        },
        creator: { select: { id: true, name: true, email: true } }
      }
    });
    if (!poll) return res.status(404).json({ message: 'Not found' });

    // shape counts cleanly
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
          include: {
            _count: { select: { votes: true} }
          }
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
  } catch (error) {
    console.error(err);
    return res.status(500).json({ message: error.message });
  }
};

export async function castVote(req, res) {
  const pollId = Number(req.params.id);
  const { userId, optionId } = req.body;
  const io = req.app.get('io');

  try {
    // validate option belongs to poll
    const option = await prisma.pollOption.findUnique({ where: { id: Number(optionId) }});
    if (!option || option.pollId !== pollId) {
      return res.status(400).json({ message: 'Option does not belong to poll' });
    }

    // check if user already has a vote for this poll
    const existing = await prisma.vote.findUnique({
      where: { userId_pollId: { userId: Number(userId), pollId } }
    });

    if (existing) {
      await prisma.vote.update({
        where: { id: existing.id },
        data: { optionId: Number(optionId) }
      });
    } else {
      await prisma.vote.create({
        data: {
          user: { connect: { id: Number(userId) } },
          option: { connect: { id: Number(optionId) } },
          poll: { connect: { id: pollId } }
        }
      });
    }

    // compute latest counts
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