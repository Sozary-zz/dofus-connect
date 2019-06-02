import MapsManager from "./../../protocol/data/map/mapsmanager"
import DataManager from "./../../protocol/data/data"
import DataTypes from "./../../protocol/data/datatypes"
import PlayerEntry from "./entities/movableentity"
import NpcEntry from "./entities/npcentry"
import MonstersGroupEntry from "./entities/monstersgroupentry"
import InteractiveElementEntry from "./interactives/interactiveelemententry"
import StatedElementEntry from "./interactives/statedelemententry"
import ElementInCellEntry from "./interactives/elementincellentry"

export default class MapGame {
    constructor(account) {
        this.account = account
        this.data = null
    }
    get id() {
        if (!this.data) {
            return -1
        }
        return this.data.id
    }
    async UpdateMapComplementaryInformationsDataMessage(
        message
    ) {
        const sameMap =
            this.data && message.mapId === this.id
        this.data = await MapsManager.getMap(
            message.mapId,
            this.account.constConfig
        )
        const mp = (await DataManager.get(
            DataTypes.MapPositions,
            this.account.constConfig
            .assetsVersion,
            this.id
        ))[0]

        const subArea = (await DataManager.get(
            DataTypes.SubAreas,
            this.account.constConfig
            .assetsVersion,
            message.subAreaId
        ))[0]
        const area = (await DataManager.get(
            DataTypes.Areas,
            this.account.constConfig
            .assetsVersion,
            subArea.areaId
        ))[0]
        this.subArea = subArea.nameId
        this.area = area.nameId
        this.posX = mp.posX
        this.posY = mp.posY

        this._players = new Map()
        this._npcs = new Map()
        this._monstersGroups = new Map()
        this._interactives = new Map()
        this._doors = new Map()
        this._statedElements = new Map()
        this._phenixs = new Map()
        this._lockedStorages = new Map()
        this._othersInteractives = new Map()
        this.teleportableCells = []
        this.blacklistedMonsters = []
        this.zaap = null
        this.zaapi = null
        this.paddock = null

        // ENTITIES
        for (const actor of message.actors) {
            if (
                actor._type ===
                'GameRolePlayCharacterInformations'
            ) {
                const parsed = actor
                if (
                    parsed.contextualId ===
                    this.account.game.character.id
                ) {
                    this.playedCharacter = new PlayerEntry(
                        parsed
                    )
                } else {
                    const pe = new PlayerEntry(
                        parsed
                    )
                    if (pe.name != undefined) {
                        if (
                            pe.name.startsWith(
                                '['
                            )
                        ) {
                            console.log(
                                'Un modo est sur la carte!'
                            )
                        }
                    }

                    this._players.set(
                        parsed.contextualId,
                        pe
                    )
                }
            } else if (
                actor._type ===
                'GameRolePlayMutantInformations'
            ) {
                const parsed = actor
                if (
                    parsed.contextualId ===
                    this.account.game.character.id
                ) {
                    this.playedCharacter = new PlayerEntry(
                        parsed
                    )
                } else {
                    this._players.set(
                        parsed.contextualId,
                        new PlayerEntry(parsed)
                    )
                }
            } else if (
                actor._type ===
                'GameRolePlayNpcInformations' ||
                actor._type ===
                'GameRolePlayNpcWithQuestInformations'
            ) {
                const parsed = actor
                this._npcs.set(
                    actor.contextualId,
                    await NpcEntry.setup(
                        parsed,
                        this.account.constConfig
                        .assetsVersion
                    )
                )
            } else if (
                actor._type ===
                'GameRolePlayGroupMonsterInformations'
            ) {
                const parsed = actor

                this._monstersGroups.set(
                    actor.contextualId,
                    await MonstersGroupEntry.setup(
                        parsed,
                        this.account.constConfig
                        .assetsVersion
                    )
                )
            }
        }
        // END_ENTITIES

        for (const interactive of message.interactiveElements) {
            this._interactives.set(
                interactive.elementId,
                new InteractiveElementEntry(
                    interactive
                )
            )
        }
        for (const stated of message.statedElements) {
            this._statedElements.set(
                stated.elementId,
                new StatedElementEntry(stated)
            )
        }

        const _zaap = message.interactiveElements.find(
            i => i.elementTypeId === 16
        )
        const _zaapi = message.interactiveElements.find(
            i => i.elementTypeId === 106
        )
        const _paddock = message.interactiveElements.find(
            i => i.elementTypeId === 120
        )

        for (const [
                cellId,
                graphicalElements,
            ] of this.data.midgroundLayer.entries()) {
            for (const graph of graphicalElements) {
                // Check for teleportable cells
                if (graph.g === 21000) {
                    this.teleportableCells.push(
                        cellId
                    )
                } else {
                    // Check for other usable interactives (like doors)
                    const interactive = this.getInteractiveElement(
                        graph.id
                    )
                    if (!interactive) {
                        continue
                    }

                    // Check if this element is a phenix
                    // (a phenix doesn't have skills that's why we check here)
                    if (graph.g === 7521) {
                        this._phenixs.set(
                            graph.id,
                            new ElementInCellEntry(
                                interactive,
                                cellId
                            )
                        )
                    }

                    if (!interactive.usable) {
                        continue
                    }

                    // Zaap
                    if (
                        _zaap &&
                        graph.id === _zaap.id
                    ) {
                        this.zaap = new ElementInCellEntry(
                            interactive,
                            cellId
                        )
                    } else if (
                        _zaapi &&
                        graph.id === _zaapi.id
                    ) {
                        // Zaapi
                        this.zaapi = new ElementInCellEntry(
                            interactive,
                            cellId
                        )
                    } else if (
                        _paddock &&
                        graph.id === _paddock.id
                    ) {
                        // Paddock
                        this.paddock = new ElementInCellEntry(
                            interactive,
                            cellId
                        )
                    } else if (
                        graph.g === 12367
                    ) {
                        // Locked Storages
                        this._lockedStorages.set(
                            graph.id,
                            new ElementInCellEntry(
                                interactive,
                                cellId
                            )
                        )
                    } else if (
                        MapGame.doorTypeIds.includes(
                            interactive.elementTypeId
                        ) &&
                        MapGame.doorSkillIds.includes(
                            interactive
                            .enabledSkills[0]
                            .id
                        )
                    ) {
                        this._doors.set(
                            graph.id,
                            new ElementInCellEntry(
                                interactive,
                                cellId
                            )
                        )
                    } else {
                        // Others
                        this._othersInteractives.set(
                            graph.id,
                            new ElementInCellEntry(
                                interactive,
                                cellId
                            )
                        )
                    }
                }
            }
        }
        console.log(
            `Toutes les infos on été récupérées pour la carte ${
                               this.currentPosition
                           }`
        )

        if (!sameMap || this._joinedFight) {
            this._joinedFight = false
            console.log('Change de carte ')
            // TODO A gerer

            if (this._firstTime) {
                this._firstTime = false
                // TODO A gerer
            }
        } else {
            console.log('Meme carte')

            // TODO A gerer
        }
    }

    static get doorTypeIds() {
        return [-1, 128, 168, 16]
    }
    static get doorSkillIds() {
        return [184, 183, 187, 198, 114, 84]
    }
    getInteractiveElement(elementId) {
        return (
            this._interactives.get(elementId) ||
            null
        )
    }
    get currentPosition() {
        return `${this.posX},${this.posY}`
    }
}