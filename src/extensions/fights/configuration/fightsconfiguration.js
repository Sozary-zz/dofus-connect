import FightStartPlacement from "./enum/fightstartplacement"
import BlockSpectatorScenarios from './enum/blockspectatorscenarios'
import FightTactics from './enum/fighttactics'
import FightSpeeds from './enum/fightspeeds'

export default class FightsConfiguration {
    constructor(account) {
        this.account = account

        this.startPlacement =
            FightStartPlacement.FAR_FROM_ENEMIES
        this.ignoreSummonedEnemies = true
        this.monsterToApproach = -1
        this.spellToApproach = -1
        this.blockSpectatorScenario =
            BlockSpectatorScenarios.NEVER
        this.lockFight = false
        this.tactic = FightTactics.FUGITIVE
        this.maxCells = 12
        this.approachWhenNoSpellCasted = false
        this.baseApproachAllMonsters = false
        this.regenStart = 80
        this.regenEnd = 100
        this.spells = []
        this.fightSpeed = FightSpeeds.NORMAL
    }

    async load() {
        // connect to database
    }
}