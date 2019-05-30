const axios = require("axios")
import constants from "./../core/constList"

export class GameConst {

    async init() {
        this.config = await this.getConfig()


        return {
            config: this.config
        }
    }
    async getConfig() {
        let response = await axios.get(
            `${constants.constant_main_uri}/config.json`
        );
        return response.data

    }


}