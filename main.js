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
            logger.log(message.data);
            touch.check(message.data);
            break;
        case 'hello':
            break;
        default:
            console.error('Message was not of a supported type: ' + message.type);
    }
},

    clean = () => {
        return new Promise((resolve, reject) => {
            logger.log({eventType: 'end', endTime: Date.now()})
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
    WSSocket = require('./websocket.js'),
    Steering = require('./steering.js'),
    Touch = require('./touch.js'),
    set2 = require('./set2ImageMap.json'),
    set1 = require('./set1ImageMap.json'),
    trainingMap = require('./trainingImageMap.json'),
    chromeLauncher = require('chrome-launcher');

let imageMap = set1,
    imageMapType = 'set1'

let iconSet = process.argv[2];
if (iconSet === 'training') {
    imageMapType = 'training';
    imageMap = trainingMap;
}
else if (iconSet === 'set1') {
    imageMapType = 'set1'
    imageMap = set1;
}
else if (iconSet === 'set2') {
    imageMapType = 'set2'
    imageMap = set2;
}
else {
    console.error("icon set not found");
    process.exit(1);
}


let stencilCondition = process.argv[3];

if (!stencilCondition) {
    console.error("stencil condition was not specified");
    process.exit(1);
}

let participantId = process.argv[4];

if (!participantId) {
    console.error("participant Id was not specified");
    process.exit(1);
}

let touch = null,
    steering = null,
    socket = null,
    drivingChrome = null,
    touchChrome = null,
    logger = new Logger(participantId);

app.use(express.static('wwwroot'));

app.get('/imageMap', (req, res) => {
    res.send(imageMap);
});

app.get('/participantId', (req, res) => {
    res.json(participantId);
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
        chromeFlags: ['--start-fullscreen', '--window-position=-1920,0', '--window-size=1920,1080', '--enable-features="CheckerImaging"', '--incognito', '--disable-pinch', '--overscroll-history-navigation=0']
    });
    touchChrome = chromeLauncher.launch({
        startingUrl: "http://localhost:3000/touchscreen/index.html",
        ignoreDefaultFlags: true,
        chromeFlags: ['--disable-gpu', '--start-fullscreen', '--window-position=-3840,0', '--window-size=1920,1080', '--enable-features="CheckerImaging"', '--disable-translate', '--disable-extensions', '--disable-background-networking', '--safebrowsing-disable-auto-update', '--disable-sync', '--metrics-recording-only', '--disable-default-apps', '--no-first-run', '--incognito', '--disable-pinch', '--overscroll-history-navigation=0']
    });
};

let server = app.listen(3000, () => {
    console.log('Starting server on port 3000');
    setTimeout(() => {
        let id = participantId;
        logger.log({eventType: 'start', id: id, startTime: Date.now(), imageMap: imageMapType, condition: stencilCondition, programArgs: process.argv});
    }, 500);

    socket = new WSSocket(messageHandler.bind(this), startChrome.bind(this));
    steering = new Steering(socket.send.bind(socket), logger.log.bind(logger), true, false);
    touch = new Touch(socket.send.bind(socket), imageMap, imageMapType);
});
