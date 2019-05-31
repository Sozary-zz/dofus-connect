import HaapiConnection from "./../connection/haapi.js";
import Network from "./../connection/network.js";
import FramesData from "./../frames/framesdata"
import Game from "./../game/game"

export default class Account {

    constructor(accountConfig, constConfig, frames) {

        this.accountConfig = accountConfig
        this.constConfig = constConfig
        this.stats = null
        this.game = new Game(this)
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