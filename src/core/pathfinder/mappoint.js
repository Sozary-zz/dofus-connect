export default class MapPoint {
    constructor(
        cellId,
        x,
        y
    ) {
        this.cellId = cellId
        this.x = x
        this.y = y
    }
    static fromCoords(x, y) {
        const cell = this.cells.find(c => c.x === x && c.y === y);
        return cell === undefined ? null : cell;
    }

    static fromCellId(cellId) {
        return this.cells.find(cell => cell.cellId === cellId) || null;
    }

}