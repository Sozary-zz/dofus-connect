const moment = require('moment')

export default class MapsFrames {
    constructor(dispatcher, config) {
        this.dispatcher = dispatcher
        this.config = config
    }
    register() {
        this.dispatcher.register(
            'CurrentMapMessage',
            this.HandleCurrentMapMessage,
            this
        )
        this.dispatcher.register(
            'MapComplementaryInformationsDataMessage',
            this
            .HandleMapComplementaryInformationsDataMessage,
            this
        )
    }
    async HandleMapComplementaryInformationsDataMessage(
        account,
        message
    ) {
        await account.game.map.UpdateMapComplementaryInformationsDataMessage(
            message
        )
    }
    async HandleCurrentMapMessage(
        account,
        message
    ) {
        await account.network.sendMessageFree(
            'MapInformationsRequestMessage', {
                mapId: message.mapId,
            }
        )
    }
}