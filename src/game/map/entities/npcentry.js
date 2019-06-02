import DataManager from "./../../../protocol/data/data"
import DataTypes from "./../../../protocol/data/datatypes"
export default class NpcEntry {
    static async setup(infos, assetsVersion) {
        const data = await DataManager.get(
            DataTypes.Npcs,
            assetsVersion,
            infos.npcId
        )
        return new NpcEntry(
            infos.contextualId,
            infos.npcId,
            infos.disposition.cellId,
            data[0]
        )
    }

    constructor(id, npcId, cellId, data) {
        this.id = id
        this.npcId = npcId
        this.cellId = cellId
        this.data = data
    }

    get name() {
        return this.data.nameId
    }
}