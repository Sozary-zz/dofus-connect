import BoostableStats from "./../../game/character/boostablestats"
export default class Configuration {
    constructor(account) {
        this.account = account

        this.showGeneralMessages = true
        this.showPartyMessages = true
        this.showGuildMessages = true
        this.showAllianceMessages = true
        this.showSaleMessages = true
        this.showSeekMessages = true
        this.showNoobMessages = true
        this.autoRegenAccepted = true
        this.acceptAchievements = true
        this.statToBoost = BoostableStats.NONE
        this.ignoreNonAuthorizedTrades = false
        this.disconnectUponFightsLimit = false
        this.spellsToBoost = []
        this.autoMount = true
        this.authorizedTradesFrom = []
        this.enableSpeedHack = false
        this.antiAgro = true
    }

    async load() {
        //load data from database (save characters)
    }
}