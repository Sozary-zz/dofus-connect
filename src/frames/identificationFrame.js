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


        account.network.phase = NetworkPhases.LOGIN;

        account.framesData.key = message.key
        account.framesData.salt = message.salt

        console.log("Connecté au serveur d'authentification");

        account.network.send("checkAssetsVersion", {
            assetsVersion: this.config.assetsVersion,
            staticDataVersion: this.config.staticDataVersion
        });
    }

    async HandleassetsVersionChecked(account, message) {
        console.log("envois des parametres de connexion...");

        account.network.send('login', {
            key: account.framesData.key,
            salt: account.framesData.salt,
            token: account.haapi.getGeneratedToken(),
            username: account.accountConfig[0].username,
        })
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
        account.data.accountCreation = message.accountCreation
        account.data.accountId = message.accountId
        account.data.communityId = message.communityId
        account.data.hasRights = message.hasRights
        account.data.login = message.login
        account.data.nickname = message.nickname
        account.data.secretQuestion = message.secretQuestion
        account.data.subscriptionEndDate = message.subscriptionEndDate === 0 ?
            undefined : moment()
            .add(message.subscriptionEndDate - Date.now(), "ms")
            .toDate()
        account.data.wasAlreadyConnected = message.wasAlreadyConnected
    }
}