import Message from "./message"
export default class ServersListMessage extends Message {
    constructor(salt, key) {
        super()
        this.salt = salt
        this.key = key
    }

    getSalt() {
        return this.salt
    }
    getKey() {
        return this.key
    }
    setSalt(value) {
        this.salt = value
    }
    setKey(value) {
        this.key = value
    }
}