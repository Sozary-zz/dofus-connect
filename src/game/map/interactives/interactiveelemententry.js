import SkillEntry from "./skills/skillentry"

export default class InteractiveElementEntry {
    constructor(elem) {
        this.id = elem.elementId
        this.elementTypeId = elem.elementTypeId
        this.name = elem._name
        this.enabledSkills = []
        this.disabledSkills = []

        for (const e of elem.enabledSkills) {
            this.enabledSkills.push(
                new SkillEntry(e)
            )
        }

        for (const e of elem.disabledSkills) {
            this.disabledSkills.push(
                new SkillEntry(e)
            )
        }
    }

    get usable() {
        return this.enabledSkills.length > 0
    }
}