'use-strict';

/**
 * Handles a message recieved from a socket.
 * @param  {Object} message message to handle
 * @example
 * // example message Object
 * {type: "thing", data: {}}
 */
let messageHandler = (message) => {
    if (!message.type) {
        console.error('Expected the message to have type');
        return;
    }
    if (!message.data) {
        console.log(message);
        console.error('Expected the message to contain data');
        return;
    }
    switch(message.type) {
        case 'touch':
            logger.log(message);
            break;
        case 'log':
            logger.log(message);
            touch.check(message.data);
            break;
        case 'sound':
            logger.log(message);
            break;
        case 'hello':
            break;
        default:
            console.error('Message was not of a supported type: ' + message.type);
    }
},

    clean = () => {
        return new Promise((resolve, reject) => {
            socket.destructor().then(() => server.close(() => logger.destructor)).catch(err => reject(err));
        });
    };

const express = require('express'),
    app = express(),
    Cleanup = require('./cleanup.js'),
    cleanup = new Cleanup(clean),
    bodyParser = require('body-parser'),
    jsonParser = bodyParser.json(),
    Logger = require('./logger.js'),
    logger = new Logger(),
    WSSocket = require('./websocket.js'),
    Steering = require('./steering.js'),
    Touch = require('./touch.js'),
    stencilImageMap = require('./stencilImageMap.json'),
    nonStencilImageMap = require('./nonStencilImageMap.json'),
    chromeLauncher = require('chrome-launcher');

let stencil = false,
    imageMap = nonStencilImageMap;

for (arg of process.argv) {
    if (arg === 'stencil') {
        stencil = true;
        imageMap = stencilImageMap;
        break;
    }
}

let touch = null,
    steering = null,
    socket = null,
    drivingChrome = null,
    touchChrome = null;

app.use(express.static('wwwroot'));

app.get('/imageMap', (req, res) => {
    if (stencil) {
        res.json(stencilImageMap);
    }
    else {
        res.json(nonStencilImageMap);
    }
});

app.get('/participantId', (req, res) => {
    res.json(logger.getCurrentParticipantId());
})

app.post('/participantId', (req, res) => {
    res.json(logger.newParticipant());
})

app.post('/presurvey', jsonParser, (req, res) => {
    if (!req.body) {
        res.sendStatus(400);
        return;
    }
    logger.log(req.body);
    res.end();
})

app.post('/postsurvey', jsonParser, (req, res) => {
    if (!req.body) {
        res.sendStatus(400);
        return;
    }
    logger.log(req.body);
    res.end();
})

app.use((req, res, next) => {
    res.status(404);
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.sendStatus(500);
})

let startChrome = () => {
    drivingChrome = chromeLauncher.launch({
        startingUrl: "http://localhost:3000/driving/index.html",
        chromeFlags: ['--incognito', '--disable-pinch', '--overscroll-history-navigation=0']
    });
    touchChrome = chromeLauncher.launch({
        startingUrl: "http://localhost:3000/touchscreen/index.html",
        ignoreDefaultFlags: true,
        chromeFlags: [  '--disable-translate', '--disable-extensions', '--disable-background-networking', '--safebrowsing-disable-auto-update', '--disable-sync', '--metrics-recording-only', '--disable-default-apps', '--mute-audio', '--no-first-run', '--incognito', '--disable-pinch', '--overscroll-history-navigation=0']
    });
};

let server = app.listen(3000, () => {
    console.log('Starting server on port 3000');
    socket = new WSSocket(messageHandler.bind(this), startChrome.bind(this));
    steering = new Steering(socket.send.bind(socket), logger.log.bind(logger), true, false);
    touch = new Touch(socket.send.bind(socket), imageMap);
});
