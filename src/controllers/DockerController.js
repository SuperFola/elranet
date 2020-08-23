'use strict';

const express = require('express');
const docker = require('../docker');

let router = express.Router();

router.get('/', (req, res) => {
    docker.info()
    .then(data => {
        res.render('docker', {
            title: 'Docker',
            containersRunning: data.ContainersRunning,
            containersPaused: data.ContainersPaused,
            kernelVersion: data.kernelVersion,
            serverVersion: data.serverVersion,
            operatingSystem: data.OperatingSystem,
            architecture: data.Architecture,
            images: data.Images,
            containers: data.Containers,
            state: data.SystemStatus !== null ? data.SystemStatus.filter(data => data[0] === 'State')[0][1] : 'unknown',
        });
    });
});

exports.router = router;