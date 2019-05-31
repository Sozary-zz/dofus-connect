const NetworkPhases = require('./../connection/networkPhases')
const moment = require('moment')
import IdentificationFailureReason from "./../core/idfailurereason"

export default class IdentifiactionFrame {
    constructor(dispatcher, config) {

        this.dispatcher = dispatcher
        this.config = config
    }
    register() {
        this.dispatcher.register("HelloConnectMessage",
            this.HandleHelloConnectMessage,
            this)
        this.dispatcher.register(
            "assetsVersionChecked",
            this.HandleassetsVersionChecked,
            this
        );
        this.dispatcher.register(
            "ConnectionFailedMessage",
            this.HandleConnectionFailedMessage,
            this
        );
        this.dispatcher.register(
            "IdentificationSuccessMessage",
            this.HandleIdentificationSuccessMessage,
            this
        );
        this.dispatcher.register(
            "IdentificationFailedBannedMessage",
            this.HandleIdentificationFailedBannedMessage,
            this
        );
        this.dispatcher.register(
            "IdentificationFailedMessage",
            this.HandleIdentificationFailedMessage,
            this
        );
    }
    async HandleHelloConnectMessage(
        account,
        message
    ) {


        account.setNetworkPhase(NetworkPhases.LOGIN);

        account.getFramesData().setKey(message.key);
        account.getFramesData().setSalt(message.salt);

        console.log("Connecté au serveur d'authentification");

        account.getNetworkContext().send("checkAssetsVersion", {
            assetsVersion: this.config.assetsVersion,
            staticDataVersion: this.config.staticDataVersion
        });
    }

    async HandleassetsVersionChecked(account, message) {
        console.log("envois des parametres de connexion...");

        account.getNetworkContext().send("login", {
            key: account.getFramesData().getKey(),
            salt: account.getFramesData().getSalt(),
            token: account.getHaapiToken(),
            username: account.getAccountConfig()[0].username
        });
    }
    async HandleConnectionFailedMessage(
        account,
        message
    ) {
        console.log("connexion échouée!");

    }
    async HandleIdentificationFailedBannedMessage(
        account,
        message
    ) {
        const date = new Date(message.banEndDate);
        console.log(`BAN: 
      } [${date.toDateString()}]`);
    }
    async HandleIdentificationFailedMessage(
        account,
        message
    ) {
        switch (message.reason) {
            case IdentificationFailureReason.BANNED:
                console.log("Compte banni");

                break;
            case IdentificationFailureReason.EMAIL_UNVALIDATED:
                console.log("Email erroné");
                break;
        }
    }

    async HandleIdentificationSuccessMessage(
        account,
        message
    ) {
        account.setData({
            accountCreation: message.accountCreation,
            accountId: message.accountId,
            communityId: message.communityId,
            hasRights: message.hasRights,
            login: message.login,
            nickname: message.nickname,
            secretQuestion: message.secretQuestion,
            subscriptionEndDate: message.subscriptionEndDate === 0 ?
                undefined : moment()
                .add(message.subscriptionEndDate - Date.now(), "ms")
                .toDate(),
            wasAlreadyConnected: message.wasAlreadyConnected,
        })
    }
}