const NetworkPhases = require('./networkPhases')


var EventEmitter = require("events").EventEmitter;

export default class Network {
    constructor(data, frames, account) {
        this._registeredMessages = new Map();
        this.data = data
        this.connected = false
        this.server = null
        this.phase = NetworkPhases.NONE
        this.frames = frames
        this.account = account
    }


    connect() {
        let url = this.data.config.dataUrl
        if (this.connected || this.phase !== NetworkPhases.NONE) {
            return
        }

        this.sessionId = this.data.config.sessionId
        const currentUrl = this.makeSticky(url, this.sessionId)

        console.log("Connexion au proxy");

        this.socket = this.createSocket(currentUrl)
        this.setCurrentConnection()
        this.socket.open()
    }

    makeSticky(url, sessionId) {
        const seperator = url.indexOf("?") === -1 ? "?" : "&";
        return (
            url +
            seperator +
            'STICKER' +
            '=' +
            encodeURIComponent(sessionId) +

            '&transport=websocket'
        )
    }

    createSocket(url) {
        return new Primus(url, {
            manual: true,
            strategy: 'disconnect,timeout',
            reconnect: {
                max: 5000,
                min: 500,
                retries: 10,
            },
        })

    }

    send(call, data) {
        if (!this.connected) {
            return;
        }

        let msg;
        let msgName;

        if (call === "sendMessage") {
            msgName = data.type;
            msg = data.data ? {
                call,
                data
            } : {
                call,
                data: {
                    type: data.type
                }
            };
        } else {
            msgName = call;
            msg = data ? {
                call,
                data
            } : {
                call
            };
        }


        this.frames.dispatcher.emit(msgName, this.account, data);
        this.socket.write(msg);

    }

    switchToGameServer(url, server) {
        this.server = server;
        if (!this.connected || this.phase !== NetworkPhases.LOGIN) {
            return;
        }
        this.phase = NetworkPhases.SWITCHING_TO_GAME;
        this.send("disconnecting", "SWITCHING_TO_GAME");
        this.socket.destroy();
        const currentUrl = this.makeSticky(url, this.sessionId);
        console.log("Connexion au jeu");
        this.socket = this.createSocket(currentUrl);
        this.setCurrentConnection();
        this.socket.open();
    }

    sendMessageFree(messageName, data) {

        this.send("sendMessage", {
            type: messageName,
            data
        });
    }
    close() {
        if (!this.connected) {
            return;
        }

        if (this.socket) {
            this.socket.destroy();
        }
    }
    setCurrentConnection() {
        this.socket.on('open', () => {
            console.log('Connection opened !')

            this.connected = true;
            if (this.phase === NetworkPhases.NONE) {

                this.send("connecting", {
                    appVersion: this.data.appVersion,
                    buildVersion: this.data.buildVersion,
                    client: "ios",
                    language: "fr",
                    server: "login"
                });
            } else {
                this.send("connecting", {
                    appVersion: this.data.appVersion,
                    buildVersion: this.data.buildVersion,
                    client: "ios",
                    language: "fr",
                    server: this.server
                });
            }

        })
        this.socket.on('data', (data) => {
            console.log(`[SERVER] => ${data._messageType}`);

            this.frames.dispatcher.emit(data._messageType, this.account, data);

        })
        this.socket.on('error', function (error) {
            console.log('[Primus error]' + error)
        })
        this.socket.on('reconnect', function (data) {
            console.log('[Primus reconnect]' + JSON.stringify(data))

        })
        this.socket.on('reconnected', function (data) {
            console.log('[Prmius reconnected]')
        })
        this.socket.on('reconnect timeout', function (
            err,
            opts
        ) {
            console.log('Timeout expired: %s', err.message)

        })
        this.socket.on('reconnect failed', function (
            err,
            opts
        ) {
            console.log('The reconnection failed: %s', err.message)

        })
        this.socket.on('end', function () {
            console.log('Primus close connection !')

        })
    }
}