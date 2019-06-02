import MovableEntity from "./movableentity"
import MonsterEntry from "./monsterentity"

export default class MonstersGroupEntry extends MovableEntity {
    static async setup(infos, assetsVersion) {
        let followers = []
        for (const u of infos.staticInfos
                .underlings) {
            followers.push(
                await MonsterEntry.setup(u, assetsVersion)
            )
        }


        const leader = await MonsterEntry.setup(
            infos.staticInfos.mainCreatureLightInfos,
            assetsVersion
        )
        const m = new MonstersGroupEntry(
            infos.contextualId,
            leader,
            followers
        )
        m.cellId = infos.disposition.cellId
        return m
    }

    constructor(id = 0, leader, followers = []) {
        super()
        this.id = id
        this.leader = leader
        this.followers = followers
    }
}