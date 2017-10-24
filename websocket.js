'use-strict';

const WebSocket = require('ws');


class WSSocket {
    constructor(messageCallback, completeCallback) {
        this.wss = new WebSocket.Server({ port: 3011 });
        this.wss.on('listening', () => {
            completeCallback();
        });
        this.wss.on('connection', (ws) => {
            ws.on('open', () => {
                console.log('web socket open');
            });

            ws.on('message', (data, flags) => {
                if (messageCallback) {
                    messageCallback(JSON.parse(data), ws);
                }
            });
        });

    }

    destructor() {
        return new Promise((resolve, reject) => {
            try {
                this.wss.close(resolve);
            }
            catch (err) {
                reject(err);
            }
        });
    }

    send(data, ws) {
        this.wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                let json = JSON.stringify(data);
                client.send(json);
            }
        });
    }
}

module.exports = WSSocket;
