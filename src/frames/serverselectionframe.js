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
            "ServersListMessage",
            this.HandleServersListMessage,
            this
        );

    }
    async HandleServersListMessage(
        account,
        message
    ) {

        const server =
            account.accountConfig.server === -1 ?
            message.servers.find(s => s.charactersCount > 0) :
            message.servers.find(s => s.id === account.accountConfig.server);
        console.log(server);

        if (
            server === undefined ||
            (server.charactersCount === 0)
        ) {
            console.log("Aucun personnage disponible");

            await account.stop();
            return;
        }

        if (
            server.status !== ServersStatus.ONLINE &&
            server.status !== ServersStatus.SAVING &&
            !server.isSelectable
        ) {
            console.log(
                `${server._name} ${ServersStatus[server.status]}, non accessible`
            );
            await account.stop();
            return;
        }
        console.log(`Le serveur ${server._name} a été sélectionné!`);

        await account.getNetworkContext().sendMessageFree("ServerSelectionMessage", {
            serverId: server.id
        });

    }
}