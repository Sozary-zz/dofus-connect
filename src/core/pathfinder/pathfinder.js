import CellData from "./celldata"
import MapPoint from "./mappoint"

export default class Pathfinder {
    constructor() {
        this.WIDTH = 35
        this.HEIGHT = 36
        this.grid = Array(this.WIDTH)
            .fill(0)
            .map(() => Array(this.HEIGHT).fill(0))
    }
    setMap(map) {
        if (!map) {
            // TODO: Error?
            return
        }
        this.firstCellZone = map.cells[0].z || 0
        this.oldMovementSystem = true
        for (let i = 0; i < this.WIDTH; i++) {
            for (
                let j = 0; j < this.HEIGHT; j++
            ) {
                this.grid[i][j] = new CellData(
                    i,
                    j
                )
                const p = MapPoint.fromCoords(
                    i - 1,
                    j - 1
                )
                this.updateCellPath2(
                    p === null ?
                    null :
                    map.cells[p.cellId],
                    this.grid[i][j].getCellContext()
                )
            }
        }
        this.oldGrid = JSON.parse(
            JSON.stringify(this.grid)
        )
    }

    updateCellPath2(
        cell,
        cellPath
    ) {
        if (
            cell !== null &&
            cell.isWalkable(false)
        ) {
            cellPath.floor = cell.f || 0
            cellPath.zone = cell.z || 0
            cellPath.speed =
                1 + (cell.s || 0) / 10
            if (
                cellPath.zone !==
                this.firstCellZone
            ) {
                this.oldMovementSystem = false
            }
        } else {
            cellPath.floor = -1
            cellPath.zone = -1
        }
    }
}