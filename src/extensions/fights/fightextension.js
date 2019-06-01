import SpellsManager from "./speelsmanager"
import FightsUtility from './utility/fightsutility'
import FightsConfiguration from './configuration/fightsconfiguration'

export default class FightsExtension {
    constructor(account) {
        this.account = account

        this.spellsManager = new SpellsManager(
            account
        )
        this.utility = new FightsUtility(account)
        this.config = new FightsConfiguration(
            account
        )

        this.setEvents()
    }
    clear() {
        this.turnId = 0
    }
    setEvents() {
        // see later
    }
}