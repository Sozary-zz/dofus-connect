import Dispatcher from "./dispatcher"
import IdentifiactionFrame from "./identificationframe"
import ServerSelectionFrame from './serverselectionframe'
import CharacterSelectionFrame from './characterselectionframe'
import MapsFrames from "./mapsframes"

export default class Frames {
    constructor(config) {
        this.dispatcher = new Dispatcher()

        this.frames = [
            new IdentifiactionFrame(this.dispatcher, config),
            new ServerSelectionFrame(this.dispatcher, config),
            new CharacterSelectionFrame(this.dispatcher, config),
            new MapsFrames(this.dispatcher, config),
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