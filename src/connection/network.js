const NetworkPhases = require('./networkPhases')
var io = require('socket.io-client')
var Primus = require('./primus.js')
var EventEmitter = require('events').EventEmitter

export default class Network {
    constructor(data) {

        this.data = data
        this.connected = false
        this.phase = NetworkPhases.NONE
    }
    connect(sessionId) {
        let url = this.data.config.dataUrl
        if (this.connected || this.phase !== NetworkPhases.NONE) {
            return
        }

        this.sessionId = sessionId
        const currentUrl = this.makeSticky(url, this.sessionId)
        console.log(currentUrl);

        console.log("Connexion au serveur d 'authentification");

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
        // return new io(url, {
        //     path: "/primus"
        // })

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
    setCurrentConnection() {
        this.socket.on('open', () => {
            console.log('Connection opened !')

        })
        this.socket.on('data', function (data) {
            console.log("msg recu");

        }) //todo gérer la reconnection avec primus il semble y avoir deux trois trucs a faire
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
            console.log('Prmus close connection !')

        })
    }
}