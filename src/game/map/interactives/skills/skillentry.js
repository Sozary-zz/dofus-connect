export default class SkillEntry {


    constructor(skill) {
        this.id = skill.skillId;
        this.instanceUid = skill.skillInstanceUid;
        this.name = skill._name;
        this.parentJobId = skill._parentJobId;
    }
}