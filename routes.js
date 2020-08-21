'use strict';

const ejs = require('ejs');
const Dockerode = require('dockerode');

// connect to the docker socket
let docker = new Dockerode({ socketPath: '/var/run/docker.sock' });

// register all the routes
async function routes(fastify, options) {
    fastify.get('/', async (req, rep) => {
        return { hello: 'world' };
    });

    // ---------------- CONTAINERS ------------------ //

    // list all the containers
    fastify.get('/containers', (req, rep) => {
        docker.listContainers((err, list) => {
            rep.send(!err ? list : err);
        });
    });

    fastify.post('/containers', (req, rep) => {
    });

    fastify.delete('/containers/:id', (req, rep) => {
        if (!req.params.id) {
            rep.send(new Error('Need the id of the container to kill'));
            return;
        }

        let container = docker.getContainer(req.params.id);
        if (container) {
            rep.send({ message: 'container was killed' });
            return;
        } else {
            rep.send(new Error('Couln\'t find the container'));
            return;
        }
    });

    // ---------------- IMAGES ------------------ //

    // list all images
    fastify.get('/images', (req, rep) => {
        docker.listImages((err, list) => {
            rep.send(!err ? list : err);
        });
    });

    // ---------------- NETWORKS ------------------ //

    // list all networks
    fastify.get('/networks', (req, rep) => {
        docker.listNetworks((err, list) => {
            rep.send(!err ? list : err);
        });
    });
}

module.exports = routes;
