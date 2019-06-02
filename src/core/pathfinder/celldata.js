import Cell from "./../../protocol/data/map/cell"

export default class CellData {

    constructor(i, j) {
        this.i = i;
        this.j = j;
        this.floor = -1
        this.zone = -1
        this.speed = 1
        this.weight = 0

    }

    getCellContext() {
        return Cell(this.i, this.j, this.floor, this.zone, this.speed, this.weight)
    }
}