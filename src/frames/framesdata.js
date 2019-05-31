export default class FramesData {
    constructor() {
        this.sequence = 0
        this.captchasCounter = 0
        this.key = null
        this.salt = null
        this.ticket = null
        this.initialized = false
        this.serverToAutoConnectTo = 0
        this.clear()
    }
    clear() {
        this.sequence = 0
        this.captchasCounter = 0
        this.key = null
        this.salt = null
        this.ticket = null
        this.initialized = false
        this.serverToAutoConnectTo = 0
    }
    getSequence() {
        return this.sequence
    }

    setSequence(value) {
        this.sequence = value
    }
    getCaptchasCounter() {
        return this.captchasCounter
    }

    setCaptchasCounter(value) {
        this.captchasCounter = value
    }
    getKey() {
        return this.key
    }

    setKey(value) {
        this.key = value
    }
    getSalt() {
        return this.salt
    }

    setSalt(value) {
        this.salt = value
    }
    getTicket() {
        return this.ticket
    }

    setTicket(value) {
        this.ticket = value
    }
    getInitialized() {
        return this.initialized
    }

    setInitialized(value) {
        this.initialized = value
    }
    getServerToAutoConnectTo() {
        return this.serverToAutoConnectTo
    }

    setServerToAutoConnectTo(value) {
        this.serverToAutoConnectTo = value
    }
}