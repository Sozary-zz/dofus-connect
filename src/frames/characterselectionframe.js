const NetworkPhases = require('./../connection/networkPhases')
const moment = require('moment')

import {
    randomString
} from './../utils/random'

export default class CharacterSelectionFrame {
    constructor(dispatcher, config) {
        this.dispatcher = dispatcher
        this.config = config
    }
    register() {
        this.dispatcher.register(
            'CharactersListMessage',
            this.HandleCharactersListMessage,
            this
        )
        this.dispatcher.register(
            'CharacterSelectedSuccessMessage',
            this
            .HandleCharacterSelectedSuccessMessage,
            this
        )
    }

    async HandleCharacterSelectedSuccessMessage(
        account,
        message
    ) {
        account.game.character.UpdateCharacterSelectedSuccessMessage(
            message
        )

        account.network.sendMessageFree(
            'kpiStartSession', {
                accountSessionId: account.data.login,
                isSubscriber: account.data.isSubscriber,
            }
        )
        account.network.send(
            'moneyGoultinesAmountRequest'
        )
        account.network.sendMessageFree(
            'QuestListRequestMessage'
        )
        account.network.sendMessageFree(
            'FriendsGetListMessage'
        )
        account.network.sendMessageFree(
            'IgnoredGetListMessage'
        )
        account.network.sendMessageFree(
            'SpouseGetInformationsMessage'
        )
        account.network.send(
            'bakSoftToHardCurrentRateRequest'
        )
        account.network.send(
            'bakHardToSoftCurrentRateRequest'
        )
        account.network.send('restoreMysteryBox')
        account.network.sendMessageFree('ClientKeyMessage', {
            key: randomString(21),
        })
        account.network.sendMessageFree(
            'GameContextCreateRequestMessage'
        )
    }

    async HandleCharactersListMessage(
        account,
        message
    ) {
        account.game.server.UpdateCharactersListMessage(
            message
        )
        if (message.characters.length > 0) {
            console.log(
                account.accountConfig[0].character
            )

            const char = message.characters.find(
                c =>
                c.name ===
                account.accountConfig[0]
                .character
            )

            if (char === undefined) {
                console.log(
                    `Personnage ${
                                       account.accountConfig[0]
                                           .character
                                   } pas trouvé!`
                )
            } else {
                await account.network.sendMessageFree(
                    'CharacterSelectionMessage', {
                        id: char.id,
                    }
                )
                console.log(
                    `Personnage sélectionné : ${
                                       char.name
                                   }, niveau ${char.level}`
                )
            }
        } else {
            console.log('Personnage introuvable!')
        }
    }
}