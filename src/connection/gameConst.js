const axios = require("axios")
import constants from "./../core/constList"

export default class GameConst {

    async init() {
        this.config = await this.getConfig()
        this.appVersion = await this.getAppVersion()
        this.buildVersion = await this.getBuildVersion()
        const m = await this.getAssetsVersions()
        this.assetsVersion = m.assetsVersion
        this.staticDataVersion = m.staticDataVersion

        return {
            config: this.config,
            appVersion: this.appVersion,
            buildVersion: this.buildVersion,
            assetsVersion: this.assetsVersion,
            staticDataVersion: this.staticDataVersion
        }
    }
    async getAssetsVersions() {
        const response = await axios.get(
            `${constants.constant_main_uri}/assetsVersions.json`
        );
        return response.data;
    }

    async getConfig() {
        let response = await axios.get(
            `${constants.constant_main_uri}/config.json`
        );
        return response.data

    }
    async getAppVersion() {
        const response = await axios.get("https://itunes.apple.com/lookup", {
            params: {
                country: "fr",
                id: 1041406978,
                lang: "fr",
                limit: 1,
                t: Date.now()
            }
        });
        return response.data.results[0].version;
    }

    async getBuildVersion() {
        const response = await axios.get(`${constants.constant_main_uri}/build/script.js`);
        const regex = /.*buildVersion=("|')([0-9]*\.[0-9]*\.[0-9]*)("|')/g;
        const m = regex.exec(response.data.substring(1, 10000));
        return m[2];
    }
}