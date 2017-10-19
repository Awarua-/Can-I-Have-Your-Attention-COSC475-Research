'use-strict';

const fs = require('fs'),
    wav = require('wav'),
    Speaker = require('speaker');

class Sound {
    constructor() {
        this.hitFile = 'sounds/hit.wav';
        this.missFile = 'sounds/miss.wav';
        this.clickFile = 'sounds/click.wav';
    }

    playFile(file) {
        let fileStream = fs.createReadStream(file),
            reader = new wav.Reader();

        reader.on('format', (format) => {
            reader.pipe(new Speaker(format));
        });
        fileStream.pipe(reader);
    }

    play(data) {
        switch(data.soundType) {
            case 'click':
                this.playFile(this.clickFile);
                break;
            case 'hit':
                this.playFile(this.hitFile);
                break;
            case 'miss':
                this.playFile(this.missFile);
                break;
            default:
                console.error("Sound type not recognised");
        }
    }
}

module.exports = Sound;
