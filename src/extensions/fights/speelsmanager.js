export default class SpellsManager {
    constructor(account) {
        this.account = account
        this.spellIdToCast = -1
        this.targetCellId = -1
    }
}