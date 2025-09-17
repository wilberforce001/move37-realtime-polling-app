import { PrismaClient } from '@prisma/client';

export const castVote = async (req, res) => {
    const pollId = parseInt(req.params.id, 10);
    const { optionId } = req.body;

    try {
        const option = await prisma.option.findFirst({
            where: { id: optionId, pollId },
        })

        if (!option) {
            return res.status(404).json({ message: 'Option not found for this poll'});
        }

        // increment vote count
        const updatedOption = await prisma.option.update({
            where: { id: optionId},
            data: { votes: { increment: 1}},
        });
        res.json(updatedOption);
    } catch (err) {
        console.error('Error casting vote', err);
        res.status(500).json({ message: 'Error casting vote'});
    }
}

const prisma = new PrismaClient();
export default prisma;