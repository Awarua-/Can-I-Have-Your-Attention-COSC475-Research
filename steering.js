'use-strict';

const gkm = require('gkm');
let Wheel = require('./wheel.js');


class Steering {

    constructor(cb, log, debug, keyboard=false) {
        // Setup debug
        this.debug = false;
        if (debug !== null) {
            this.debug = debug;
        }

        this.callback = cb;
        this.log = log;
        this.keyboard = keyboard;
        this.hold = false;

        if (keyboard) {
            this.setupKeyboardInput();
        }
        else {
            this.setupWheel();
        }

        this.setupSpaceInput();
    }

    setupSpaceInput() {
        gkm.events.on('key.pressed', data => {
            if (data[0] === 'Space' && !this.hold) {
                this.hold = true;
                this.startSpaceTime = Date.now();
                this.log({eventType:'focusstart', startTime: this.startSpaceTime});
            }
        });

        gkm.events.on('key.released', data => {
            if (data[0] === 'Space') {
                this.hold = false;
                let time = Date.now();
                this.log({eventType: 'focusend', startTime: this.startSpaceTime, endTime: time, elapsedTime: time - this.startSpaceTime});
            }
        });
    }

    setupKeyboardInput() {
        if (!this.keyboardValue) {
            this.keyboardValue = 0.5;
        }
        gkm.events.on('key.*', data => {
            if (data[0] === 'Left') {
                this.keyboardValue = Math.max(0, this.keyboardValue - 0.02);
                this.callback({type: "steering", data: this.keyboardValue});
            }
            else if (data[0] === 'Right') {
                this.keyboardValue = Math.min(1, this.keyboardValue + 0.02)
                this.callback({type: "steering", data: this.keyboardValue});
            }
        });

    }

    setupWheel() {
        try {
            this.wheel = new Wheel(this.callback);
        }
        catch (e) {
            console.error(e);
            console.log("Setting up keyboard fall back.");
            this.setupKeyboardInput();
        }
    }

    setDebug(debug) {
        this.debug = debug;
    }

    limitValue(x, limit) {
        if (x > 0) {
            return Math.min(x, +limit);
        }
        else {
            return Math.max(x, -limit);
        }
    }

    destructor() {
        return new Promise((resolve, reject) => {
            if (!this.keyboard && this.wheel) {
                this.wheel.destructor();
            }
        })
    }

}
module.exports = Steering;
