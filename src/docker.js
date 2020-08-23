'use strict';

const Dockerode = require('dockerode');
// connect to the docker socket
let docker = new Dockerode({ socketPath: '/var/run/docker.sock' });

module.exports = docker;