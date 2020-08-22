'use strict';

const express = require('express');
const Dockerode = require('dockerode');

const router = express.Router();
// connect to the docker socket
let docker = new Dockerode({ socketPath: '/var/run/docker.sock' });

// ---------------- CONTAINERS ------------------ //

// list all the containers
router.get('/containers', (req, res) => {
    docker.listContainers((err, list) => {
        res.json(!err ? list : err);
    });
});

router.post('/containers', (req, res) => {
});

router.delete('/containers/:id', (req, res) => {
    if (!req.params.id) {
        res.json(new Error('Need the id of the container to kill'));
        return;
    }

    let container = docker.getContainer(req.params.id);
    if (container) {
        res.json({ message: 'container was killed' });
        return;
    } else {
        res.send(new Error('Couln\'t find the container'));
        return;
    }
});

// ---------------- IMAGES ------------------ //

// list all images
router.get('/images', (req, res) => {
    docker.listImages((err, list) => {
        res.json(!err ? list : err);
    });
});

// ---------------- NETWORKS ------------------ //

// list all networks
router.get('/networks', (req, res) => {
    docker.listNetworks((err, list) => {
        res.json(!err ? list : err);
    });
});

module.exports = router;