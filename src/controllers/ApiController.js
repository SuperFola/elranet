'use strict';

const express = require('express');
const logger = require('../logger');

const router = express.Router();
const docker = require('../docker');

// ---------------- CONTAINERS ------------------ //

// list all the containers
router.get('/containers', (req, res) => {
    docker.listContainers((err, list) => {
        res.json(!err ? list : err);
    });
});

// create a new container
router.post('/containers', (req, res) => {
    if (req.body.newContainerSelectImage === undefined)
        return res.json({ error: 'Missing parameters to create a new container', });

    if (!req.body.containerCommand)
        req.body.containerCommand = '';

    let options = {
        Tty: req.body.tty,
        AttachStdin: req.body.attachStdin,
        AttachStdout: req.body.attachStdout,
        AttachStderr: req.body.attachStderr,
    };

    if (req.body.containerName !== '')
        options.name = req.body.containerName;

    docker.run(
        req.body.newContainerSelectImage,
        req.body.containerCommand.split(' '),
        process.stdout,
        options,
        (err, data, container) => {
            if (err)
                logger.error(err);
        }
    ).on('container', container => {
        if (req.body.volumes && req.body.volumes.split('\n').length !== 0)
            container.defaultOptions.start.Binds = req.body.volumes.split('\n');
    });
    return res.json({ success: 'container was created' });
});

// kill a container
router.delete('/containers/:id', (req, res) => {
    if (!req.params.id)
        return res.json({ error: 'Need the id of the container to kill', });

    let container = docker.getContainer(req.params.id);
    if (container) {
        container.kill((err, data) => {});
        return res.json({ success: 'Container was killed', });
    }
    return res.json({ error: 'Couldn\'t find container', });
});

// get running processes in a container
router.get('/containers/:id/ps', (req, res) => {
    if (!req.params.id)
        return res.json({ error: 'Need the id of the container to get running processes of', })

    let container = docker.getContainer(req.params.id);
    if (container) {
        container.top((err, data) => {
            if (err)
                res.json({ error: err, });
            else
                res.json(data);
        });
        return;
    }
    return res.json({ error: 'Couldn\'t find container', });
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

exports.router = router;