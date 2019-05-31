import Dispatcher from "./dispatcher"
import IdentifiactionFrame from "./identificationFrame"
import ServerSelectionFrame from './serverselectionframe'

export default class Frames {
    constructor(config) {
        this.dispatcher = new Dispatcher()

        this.frames = [
            new IdentifiactionFrame(this.dispatcher, config),
            new ServerSelectionFrame(this.dispatcher, config),
        ]

        this.init()
    }
    init() {
        for (const f of this.frames)
            f.register()
    }
    getDispatcher() {
        return this.dispatcher
    }
}