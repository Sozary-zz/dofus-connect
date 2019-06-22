import HaapiConnection from "./../connection/haapi.js";
import Network from "./../connection/network.js";
import FramesData from "./../frames/framesdata"
import Game from "./../game/game"
import AccountStats from "./accountstats"
import Extensions from "./../extensions/extensions"
import Configuration from "./configuration/configuration"

export default class Account {

    constructor(accountConfig, constConfig, frames, mapLoadedEvent) {

        this.accountConfig = accountConfig
        this.mapLoadedEvent = mapLoadedEvent
        this.constConfig = constConfig
        this.game = new Game(this)
        this.config = new Configuration(this)
        this.extensions = new Extensions(this)
        this.stats = new AccountStats(this)
        this.network = new Network(constConfig, frames, this)
        this.haapi = new HaapiConnection(
            accountConfig[0].username,
            accountConfig[0].password,
            accountConfig[0].server,
            accountConfig[0].other,
            constConfig
        );
        this.data = {}

        this.framesData = new FramesData()
    }

    async stop() {
        this.stats.connected = false;
        await this.stats.save();

        this.network.close();
    }


    async connect() {
        await this.haapi.start()
        this.network.connect();
    }
}