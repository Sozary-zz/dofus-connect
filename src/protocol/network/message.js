export default class Message {
    constructor() {
        this._messageType = ""
        this._isInitialized = false
    }
    get _isInitialized() {
        return this._isInitialized
    }
    get _messageType() {
        return this._messageType
    }
    set _isInitialized(value) {
        this._isInitialized = value
    }
    set _messageType(value) {
        this._messageType = value
    }
}