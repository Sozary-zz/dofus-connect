const NetworkPhases = require('./../connection/networkPhases')
import ServersStatus from "./../core/serversstatus"
const moment = require('moment')

export default class ServerSelectionFrame {
    constructor(dispatcher, config) {
        this.dispatcher = dispatcher
        this.config = config
    }
    register() {
        this.dispatcher.register(
            'ServersListMessage',
            this.HandleServersListMessage,
            this
        )

        this.dispatcher.register(
            'SelectedServerDataMessage',
            this.HandleSelectedServerDataMessage,
            this
        )

        this.dispatcher.register(
            'HelloGameMessage',
            this.HandleHelloGameMessage,
            this
        )
        this.dispatcher.register(
            'AuthenticationTicketAcceptedMessage',
            this
            .HandleAuthenticationTicketAcceptedMessage,
            this
        )
    }
    async HandleAuthenticationTicketAcceptedMessage(
        account,
        message
    ) {
        account.network.sendMessageFree(
            'CharactersListRequestMessage'
        )
    }

    async HandleSelectedServerDataMessage(
        account,
        message
    ) {
        account.game.server.UpdateSelectedServerDataMessage(
            message,
            this.config
        )
        account.framesData.ticket = message.ticket

        account.network.switchToGameServer(
            message._access, {
                address: message.address,
                id: message.serverId,
                port: message.port,
            }
        )
    }

    async HandleHelloGameMessage(
        account,
        message
    ) {
        account.network.sendMessageFree(
            'AuthenticationTicketMessage', {
                lang: 'fr',
                ticket: account.framesData.ticket,
            }
        )
        account.network.phase = NetworkPhases.GAME
    }

    async HandleServersListMessage(
        account,
        message
    ) {
        const server =
            account.accountConfig[0].server === '' ?
            message.servers.find(
                s => s.charactersCount > 0
            ) :
            message.servers.find(
                s =>
                s._name ===
                account.accountConfig[0]
                .server
            )
        if (
            server === undefined ||
            server.charactersCount === 0
        ) {
            console.log(
                'Aucun personnage disponible'
            )

            await account.stop()
            return
        }

        if (
            server.status !==
            ServersStatus.ONLINE &&
            server.status !==
            ServersStatus.SAVING &&
            !server.isSelectable
        ) {
            console.log(
                `${server._name} ${
                                   ServersStatus[server.status]
                               }, non accessible`
            )
            await account.stop()
            return
        }
        console.log(
            `Le serveur ${
                               server._name
                           } a été sélectionné!`
        )

        await account.network.sendMessageFree(
            'ServerSelectionMessage', {
                serverId: server.id,
            }
        )
    }
}