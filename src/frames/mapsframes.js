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

        this.dispatcher.register(
            'GameMapNoMovementMessage',
            this.HandleGameMapNoMovementMessage,
            this
        )
    }

    async HandleGameMapNoMovementMessage(
        account,
        message
    ) {
        console.log("ff");

        if (
            account.state ===
            AccountStates.FIGHTING ||
            account.state ===
            AccountStates.RECAPTCHA
        ) {
            return
        }

        account.state = AccountStates.NONE
        await account.game.managers.movements.UpdateGameMapNoMovementMessage(
            account,
            message
        )
    }
    async HandleMapComplementaryInformationsDataMessage(
        account,
        message
    ) {
        await account.game.map.UpdateMapComplementaryInformationsDataMessage(
            message
        )
        account.network.sendMessageFree(
            'CharacterExperienceGainMessage', {
                experienceCharacter: 1200,
                experienceMount: 0,
                experienceGuild: 0,
                experienceIncarnation: 0,
            }
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