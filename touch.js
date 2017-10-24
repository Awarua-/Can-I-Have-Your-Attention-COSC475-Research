'use-strict';

const seedrandom = require('seedrandom'),
    PRNG = seedrandom('beaasdrfjlkjw ajer0u023058092iio bneed to add more entropy!!!!!!!');

class Touch {
    constructor(cb, imageMap, imageMapType) {
        this.targetSequence = [];
        this.callback = cb;
        this.imageMap = imageMap;
        this.imageMapType = imageMapType;

        this.sequenceRepeats = 8;
        if (this.imageMapType === 'training') {
            this.sequenceRepeats = 2;
        }

        this.sequenceNumber = 0;

        this.currentTarget = null;
        this.generateSequence();
    }

    generateSequence() {
        for (let i = 0; i < this.sequenceRepeats; i++) {
            let sequence = Object.keys(this.imageMap);
            sequence = this.shuffle(sequence);
            this.targetSequence = this.targetSequence.concat(sequence);
        }

        this.gen = this.nextTarget();
        setTimeout(this.sendMessage.bind(this), 10000, 'Return hands to steering wheel between touches');
        setTimeout(this.sendTargetUpdate.bind(this), 20000, this.gen.next().value);
    }

    check(message) {
        if (message.hit && this.currentTarget === message.target) {
            this.sendClearUpdate();
            // choose a new target
            // send clear
            let next = this.gen.next();
            if (next.done) {
                this.sendMessage('Finished');
            }
            else {
                if (Object.keys(this.imageMap).length % this.sequenceNumber === 0 && this.imageMapType !== 'training') {
                    setTimeout(this.sendTargetUpdate.bind(this), 10000, next.value);
                }
                else {
                    setTimeout(this.sendTargetUpdate.bind(this), 1000, next.value);
                }
            }
            // wait for random timeout
            // send new target
        }
    }

    sendTargetUpdate(target) {
        this.currentTarget = target;
        this.callback({type: 'display', data: {target: this.currentTarget}});
        this.sequenceNumber += 1;
    }

    sendClearUpdate() {
        this.callback({type: 'display', data: {target: null}});
    }

    sendMessage(messageString) {
        var obj = {type: 'display', data: {message: messageString}};
        this.callback(obj);
    }

    *nextTarget() {
        for (let targetId of this.targetSequence) {
            yield targetId;
        }
    }

    getRandomInt(min, max) {
        return Math.floor(PRNG() * (max - min + 1)) + min;
    }

    shuffle(array) {
      var i = 0
        , j = 0
        , temp = null

      for (i = array.length - 1; i > 0; i -= 1) {
        j = Math.floor(PRNG() * (i + 1))
        temp = array[i]
        array[i] = array[j]
        array[j] = temp
      }
      return array
    }
}

module.exports = Touch;
