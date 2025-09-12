const { text } = require('express');
const prisma = require('./prismaClient');
const { connect, options } = require('./routes/polls');
async function main() {
    const alice = await prisma.user.create({ data: { name: 'Alice', email: 'alice@example.com', passwordHash: 'seed' } });
    const poll = await prisma.poll.create({
        data: {
            question: 'What is your favorite color?',
            creator: { connect: { id: alice.id }},
            options: { create: [{ text: 'Red' }, { text: 'Blue'}, { text: 'Green' }] }
        }
    });
    console.log('seed done');
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());