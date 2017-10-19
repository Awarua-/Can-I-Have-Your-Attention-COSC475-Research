'use-strict';

const seedrandom = require('seedrandom'),
    PRNG = seedrandom('foo');

class Touch {
    constructor(cb, imageMap) {
        this.targetSequence = [];
        this.callback = cb;
        this.imageMap = imageMap;

        this.sequenceRepeats = 3;
        this.currentTarget = null;
        this.generateSequence();


    }

    generateSequence() {
        for (let i = 0; i < this.sequenceRepeats; i++) {
            let sequence = Object.keys(this.imageMap);
            this.targetSequence = this.targetSequence.concat(sequence);
        }
        this.shuffle();
        this.gen = this.nextTarget();
        setTimeout(this.sendTargetUpdate.bind(this), 30000);
    }

    check(message) {
        if (message.hit && this.currentTarget === message.target) {
            this.sendClearUpdate();
            // choose a new target
            // send clear
            // let time = this.getRandomInt(3, 7) * 1000;
            setTimeout(this.sendTargetUpdate.bind(this), 1000);
            // wait for random timeout
            // send new target
        }
    }

    sendTargetUpdate() {

        this.currentTarget = this.gen.next().value;
        this.callback({type: 'display', data: {target: this.currentTarget}});
    }

    sendClearUpdate() {
        this.callback({type: 'display', data: {target: null}});
    }

    *nextTarget() {
        for (let targetId of this.targetSequence) {
            yield targetId;
        }
    }

    getRandomInt(min, max) {
        //TODO seed random
        return Math.floor(PRNG() * (max - min + 1)) + min;
    }

    shuffle() {
      var i = 0
        , j = 0
        , temp = null

      for (i = this.targetSequence.length - 1; i > 0; i -= 1) {
        j = Math.floor(PRNG() * (i + 1))
        temp = this.targetSequence[i]
        this.targetSequence[i] = this.targetSequence[j]
        this.targetSequence[j] = temp
      }
    }
}

module.exports = Touch;
