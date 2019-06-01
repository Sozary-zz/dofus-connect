import DataManager from "./../../protocol/data/data"
import DataTypes from "./../../protocol/data/datatypes"
export default class Server {
    constructor(account) {
        this.characters = []
    }

    async UpdateSelectedServerDataMessage(
        message,
        config
    ) {
        this.id = message.serverId
        const serverResp = await DataManager.get(
            DataTypes.Servers,
            config.assetsVersion,
            this.id
        )
        this.name = serverResp[0].nameId
    }
    async UpdateCharactersListMessage(
        message
    ) {
        if (message.characters.length > 0) {
            this.characters.concat(
                message.characters
            )
        }
    }
}