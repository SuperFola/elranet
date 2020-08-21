'use strict';

require('dotenv').config();

const fastify = require('fastify')({
    logger: true
});

fastify.register(require('fastify-cookie'), {
    secret: process.env.SECRET,
    parseOptions: {},
});

fastify.register(require('./routes'));

// run the server
const start = async () => {
    try {
        // when deploying to docker, fastify.listen(port, '::') to bind to anything
        // on ipv4 and ipv6, easier to expose the app
        await fastify.listen(3000);
    } catch (err) {
        fastify.log.error(err);
        process.exit(-1);
    }
};

start();
