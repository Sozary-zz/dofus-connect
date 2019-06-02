import MovableEntity from "./movableentity"
export default class PlayerEntry extends MovableEntity {
    constructor(
        infos
    ) {
        super();
        if (infos._type === "GameRolePlayCharacterInformations") {
            this.info_type = "GameRolePlayCharacterInformations";
            this.id = infos.contextualId;
            this.name = infos.name;
            this.cellId = infos.disposition.cellId;
            this.level = infos.alignmentInfos.characterPower - this.id;
        } else if (infos._type === "GameRolePlayMutantInformations") {
            this.info_type = "GameRolePlayMutantInformations";
            this.id = infos.contextualId;
            this.name = infos.name;
            this.cellId = infos.disposition.cellId;
            this.level = 0;
        }
    }

}