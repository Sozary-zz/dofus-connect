export default class StatedElementEntry {

    constructor(elem) {
        this.id = elem.elementId;
        this.cellId = elem.elementCellId;
        this.state = elem.elementState;
    }
}