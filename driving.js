'use-strict';

const fs = require('fs');

fs.readFileAsync = function(filename) {
    return new Promise(function(resolve, reject) {
        fs.readFile(filename, function(err, data){
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
};

class Driving {
    constructor(cb) {
        this.callback = cb;
        this.loadRoute().then(this.playsequence.bind(this)).catch((err) => {
            console.error("Something went wrong: " + err);
        });
        this.speed = 2;
    }

    loadRoute() {
        return new Promise((resolve, reject) => {
            let prom = new Promise((resolve, reject) => {
                fs.readFile('sequence.json', {encoding: 'utf-8'}, (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(data);
                    }
                });
            });
            prom.then((data) => {
                this.sequence = JSON.parse(data);
                resolve();
            }).catch((err) => {
                reject(err);
            });
        });
    }

    destructor() {
        return new Promise((resolve, reject) => {
            if (this.timeout) {
                clearTimeout(this.timeout);
            }
            resolve();
        });
    }

    playsequence() {
        if (!this.sequenceIndex) {
            this.sequenceIndex = 0;
            this.last_angle = 0;
            this.last_delta = 0;
        }
        let step = this.sequence[this.sequenceIndex];
        let angle = parseFloat(step.angle);
        let delta_angle = Math.abs(angle - this.last_angle);
        // console.log(angle);
        // console.log(this.last_angle);
        //this.timeout = setTimeout(this.step.bind(this), parseInt(parseFloat(step.length) / this.speed * 1000), {type: "direction", data: {"position": parseFloat(step.angle)}});
        this.timeout = setTimeout(this.step.bind(this), this.last_delta * 15000, {type: "direction", data: {"position": angle}});
        this.sequenceIndex = (this.sequenceIndex + 1) % this.sequence.length;
        this.last_angle = angle;
        this.last_delta = delta_angle
    }

    step(data) {
        this.callback(data);
        this.playsequence();
    }
}

module.exports = Driving;
