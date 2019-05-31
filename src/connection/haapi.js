const axios = require("axios")
export default class HaapiConnection {
    constructor(login, pass, server, pseudo, data) {
        this.login = login
        this.pass = pass
        this.server = server
        this.pseudo = pseudo
        this.axios = axios.create({})
        this.consts = data
    }
    getGeneratedToken() {
        return this.token
    }

    async start() {
        try {
            this.haapi = await this.createToken()

            if (this.haapi.reason) {
                switch (this.haapi.reason) {
                    case HaapiErrorReasons.FAILED:
                        console.log('Mauvais mdp/id')
                        throw new Error("Mauvais mdp/id")
                    case HaapiErrorReasons.BAN:
                        console.log('compte banni')
                        throw new Error("compte banni")
                    case HaapiErrorReasons.BRUTEFORCE:
                        console.log('tentative bruteforce')
                        throw new Error("tentative bruteforce")
                }
            }

            this.token = await this.getToken()
        } catch (e) {
            throw new Error(e.message)
        }
    }

    async getToken() {

        const config = {
            headers: {
                apikey: this.haapi.key
            },
            params: {
                game: this.consts.config.haapi.id
            }
        };
        try {
            const response = await this.axios.get(
                `${this.consts.config.haapi.url}/Account/CreateToken`,
                config
            );
            return response.data.token;
        } catch (e) {
            throw new Error(e.message);
        }
    }


    async createToken() {
        try {

            const response = await this.axios.post(
                `${this.consts.config.haapi.url}/Api/CreateApiKey`,
                'login=' +
                this.login +
                '&password=' +
                this.pass +
                '&long_life_token=false'
            )
            return response.data
        } catch (e) {
            if (e.response.status === 601) return e.reponse.data
            throw new Error(e.message)
        }

    }
}