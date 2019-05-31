import HaapiConnection from "./../connection/haapi.js";
import Network from "./../connection/network.js";
import FramesData from "./../frames/framesdata"

export default class Account {

    constructor(accountConfig, constConfig, frames) {

        this.accountConfig = accountConfig
        this.constConfig = constConfig
        this.stats = null
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


    setData(new_data) {
        this.data = new_data
    }
    getData() {
        return this.data
    }
    getAccountConfig() {
        return this.accountConfig
    }

    getHaapiToken() {
        return this.haapi.getGeneratedToken()
    }

    getNetworkContext() {
        return this.network
    }

    setNetworkPhase(phase) {
        this.network.setPhase(phase)
    }

    getFramesData() {
        return this.framesData
    }

    setFramesDataKey(key) {
        this.framesData.setKey(key)
    }
    setFramesDataSalt(salt) {
        this.framesData.setSalt(salt)
    }


    getNetwork() {
        return this.network
    }

    async connect() {
        await this.haapi.start()
        this.network.connect();
    }
}