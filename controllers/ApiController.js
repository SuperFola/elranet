'use strict';

const express = require('express');
const Dockerode = require('dockerode');
const logger = require('../logger');

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
    if (req.body.newContainerSelectImage === undefined)
        return res.json({ error: 'Missing parameters to create a new container', });

    if (!req.body.containerCommand)
        req.body.containerCommand = '';

    let options = {
        Tty: req.body.tty === 'on',
        AttachStdin: req.body.attachStdin === 'on',
        AttachStdout: req.body.attachStdout === 'on',
        AttachStderr: req.body.attachStderr === 'on',
    };
    if (req.body.containerName !== '')
        options.name = req.body.containerName;

    docker.run(
        req.body.newContainerSelectImage,
        req.body.containerCommand.split(' '),
        process.stdout,  // stream output
        options,
        (err, data, container) => {
            if (err) {
                logger.error(err);
                return res.json({ error: `while creating container: ${err}` });
            } else {
                logger.info(data);
                return res.json({ success: 'container was created' });
            }
        }
    ).on('container', container => {
        if (req.body.volumes && req.body.volumes.split('\n').length !== 0)
            container.defaultOptions.start.Binds = req.body.volumes.split('\n');
    });
    return res.json({ success: 'container was created' });
});

router.delete('/containers/:id', (req, res) => {
    if (!req.params.id)
        return res.json({ error: 'Need the id of the container to kill', });

    let container = docker.getContainer(req.params.id);
    if (container) {
        let ok = false;
        container.kill((err, data) => {
            if (err)
                return res.json({ error: `When trying to kill container: ${err}`, });
            else
                ok = true;
        });
        if (ok)
            return res.json({ success: 'container was killed',  });
    } else {
        return res.json({ error: 'Couln\'t find the container', });
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

module.exports = {
    router: router,
    docker: docker,
};