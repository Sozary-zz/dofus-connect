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

}