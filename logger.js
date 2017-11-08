'use-strict';

const fs = require('fs'),
    directory = "results";


class Logger {
    constructor(participantId) {
        this.participantId = participantId;
        this._checkForDirectory()
        .then(() => this._createFileHandle())
        .catch(error => {
            console.log(error);
        });
    }

    destructor() {
        return this._closeFileStream();
    }

    _checkForDirectory() {
        return new Promise((resolve, reject) => {
            fs.stat(directory, (err, stats) => {
                if (err) {
                    console.warn(directory + " folder does not exist");
                    fs.mkdir(directory, 0o777, () => {
                        resolve();
                    });
                }
                else if (!stats.isDirectory()) {
                    reject(directory + " was defined, but was not a directory");
                }
                else {
                    resolve();
                }
            })
        });
    }

    _closeFileStream() {
        return new Promise((resolve, reject) => {
            try {
                if (this.fileStream) {
                    this.fileStream.end(resolve);
                }
                else {
                    resolve();
                }
            } catch (err) {
                reject(err);
            }
        });
    }

    _createFileHandle() {
        return new Promise((resolve, reject) => {
            this._closeFileStream().then(() => {
                const path = directory + '/' + this.participantId + '.txt';
                this.fileStream = fs.createWriteStream(path, {flags: "a+", encoding: 'utf-8',mode: 0o777});
                this.fileStream.on('error', e => { console.error(e); });
                resolve();
            }).catch(error => reject(error));
        });
    }

    getCurrentParticipantId() {
        return this.currentParticipantId;
    }

    log(data) {
        //FIXME race condition, when opening new file to write too.
        if (data.participantId && data.participantId !== this.participantId) {
            console.error("participant Id does not match the file being logged to");
            //FIXME raise exception?
        }
        let dataString = data;
        if (typeof data === 'object') {
            dataString = JSON.stringify(data);
        }

        this.fileStream.write(dataString + '\n');
    }

}

module.exports = Logger;
