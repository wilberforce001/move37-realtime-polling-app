const prisma = require('../prismaClient');
const { connect, options } = require('../routes/polls');

exports.createPoll = async (req, res) => {

    try {
        const { question, options, creatorId, isPublished } = req.body;
        const poll = await prisma.poll.create({
            data: {
                question,
                isPublished: !!isPublished,
                creator: { connect: { id: creatorId } },
                options: { create: options.map(text => ({ text })) },
            },
            include: { options: true },
        });
        return res.status(201).json(poll);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};

exports.getPoll = async (req, res) => {
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
};

exports.castVote = async (req, res) => {
    // expected: req.params.id (pollId), body: { userId, optionId }
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
            // change their vote (update option)
            await prisma.vote.update({ where: { id: existing.id }, data: { optionId: Number(optionId) } });
        } else {
            // create new vote
            await prisma.vote.create({
                data: {
                    user: { connect: { id: Number(userId) } },
                    option: { connect: { id: Number(optionId) } },
                    poll: { connect: { id: pollId } }
                }
            });
        }

        // compute latest counts for poll options
        const options = await prisma.pollOption.findMany({
            where: { pollId },
            include: { _count: { select: { votes: true } } }
        });

        const payload = options.map(o => ({ id: o.id, text: o.text, votes: o._count.votes }));

        // broadcast to clients in this poll room
        io.to(`poll_${pollId}`).emit('pollUpdated', { pollId, options: payload });

        return res.json({ success: true, options: payload });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};

// Reference: https://socket.io/docs/v3/rooms/?utm_source=chatgpt.com
