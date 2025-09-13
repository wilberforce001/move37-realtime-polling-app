import { text } from 'express';
import { user, poll as _poll, $disconnect } from './prismaClient';
import { connect, options } from './routes/polls';
async function main() {
    const alice = await user.create({ data: { name: 'Alice', email: 'alice@example.com', passwordHash: 'seed' } });
    const poll = await _poll.create({
        data: {
            question: 'What is your favorite color?',
            creator: { connect: { id: alice.id }},
            options: { create: [{ text: 'Red' }, { text: 'Blue'}, { text: 'Green' }] }
        }
    });
    console.log('seed done');
}

main().catch(e => console.error(e)).finally(() => $disconnect());