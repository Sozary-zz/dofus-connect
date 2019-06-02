import DataManager from "./../../../protocol/data/data"
import DataTypes from "./../../../protocol/data/datatypes"

export default class MonsterEntry {
    static async setup(infos, assetsVersion) {
        const monsterEntry = new MonsterEntry()
        monsterEntry.genericId =
            infos.creatureGenericId
        monsterEntry.grade = infos.grade

        const data = await DataManager.get(
            DataTypes.Monsters, assetsVersion,
            monsterEntry.genericId
        )

        const m = data[0]
        monsterEntry.name = m.nameId
        monsterEntry.level =
            m.grades[monsterEntry.grade - 1].level
        monsterEntry.boss = m.isBoss
        monsterEntry.miniBoss = m.isMiniBoss
        monsterEntry.questMonster =
            m.isQuestMonster

        return monsterEntry
    }
}