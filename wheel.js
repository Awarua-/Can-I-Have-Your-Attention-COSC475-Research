'use-strict';

const g = require('logitech-g29');


class Wheel {

    constructor(cb) {
        this.callback = cb;
        this.heading = 50;
        g.connect({range: 270, autocenter: [0.3, 0.5]}, (err) => {
            if (!err) {
                // g.forceOff();

                g.on('wheel-turn', (val) => {
                    clearInterval(this.timeout);
                    this.timeout = setInterval(this.updateWheelPosition.bind(this), 2, val);
                });
            }
        });

    }

    updateWheelPosition(val) {
        this.heading += (val - 50) / 500;
        let pos = this.heading.toFixed(1);
        pos /= 100;
        if (!this.lastValue) {
            this.lastValue = pos;
        }
        else if (this.lastValue !== pos) {

            this.lastValue = pos;
        }

        this.callback({type: "steering", data: Math.max(0, Math.min(1, pos))});
    }

    destructor() {
        return new Promise((resolve, reject) => {
            g.disconnect();
            resolve();
        });
    }

}

module.exports = Wheel;
