import CellData from "./celldata"
import MapPoint from "./mappoint"
import CellPath from "./cellpath"

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
    getPath(
        source,
        target,
        occupiedCells,
        allowDiagonal,
        stopNextToTarget
    ) {
        let c = 0;
        let candidate = null;
        const srcPos = MapPoint.fromCellId(source);
        const dstPos = MapPoint.fromCellId(target);
        if (!srcPos || !dstPos) {
            return [];
        }
        const si = srcPos.x + 1;
        const sj = srcPos.y + 1;
        const srcCell = this.grid[si][sj];
        if (srcCell.zone === -1) {
            let bestFit = null;
            let bestDist = Infinity;
            let bestFloorDiff = Infinity;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (i === 0 && j === 0) {
                        continue;
                    }
                    const cell = this.grid[si + i][sj + j];
                    if (cell.zone === -1) {
                        continue;
                    }
                    const floorDiff = Math.abs(cell.floor - srcCell.floor);
                    const dist = Math.abs(i) + Math.abs(j);
                    if (
                        bestFit === null ||
                        floorDiff < bestFloorDiff ||
                        (floorDiff <= bestFloorDiff && dist < bestDist)
                    ) {
                        bestFit = cell;
                        bestDist = dist;
                        bestFloorDiff = floorDiff;
                    }
                }
            }

            if (bestFit) {
                const point = MapPoint.fromCoords(bestFit.i + 1, bestFit.j + 1);
                if (point) {
                    return [source, point.cellId];
                }
            }
            console.log(`[Pathfinder] Player stuck in ${si}/${sj}`)
            throw new Error(`[Pathfinder] Player stuck in ${si}/${sj}`);
        }
        const di = dstPos.x + 1;
        const dj = dstPos.y + 1;
        let cellPos = null;
        for (const cellId of occupiedCells) {
            cellPos = MapPoint.fromCellId(cellId);
            if (!cellPos) {
                continue;
            }
            this.grid[cellPos.x + 1][
                cellPos.y + 1
            ].weight += this.OCCUPIED_CELL_WEIGHT;
        }
        let candidates = [];
        const selections = [];
        const distSrcDst = Math.sqrt(Math.pow(si - di, 2) + Math.pow(sj - dj, 2));
        let selection = new CellPath(si, sj, 0, distSrcDst, null);
        let reachingPath = null;
        let closestPath = selection;
        while (selection.i !== di || selection.j !== dj) {
            this.addCandidates(selection, di, dj, candidates, allowDiagonal);
            const n = candidates.length;
            if (n === 0) {
                selection = closestPath; // TODO: Value assigned is not used in any execution path ?
                break;
            }
            let minPotentialWeight = Infinity;
            let selectionIndex = 0;
            for (c = 0; c < n; c++) {
                candidate = candidates[c];
                if (candidate.w + candidate.d < minPotentialWeight) {
                    selection = candidate;
                    minPotentialWeight = candidate.w + candidate.d;
                    selectionIndex = c;
                }
            }
            selections.push(selection);
            candidates.splice(selectionIndex, 1);
            if (selection.d === 0 || (stopNextToTarget && selection.d < 1.5)) {
                // Selected path reached destination
                if (reachingPath === null || selection.w < reachingPath.w) {
                    reachingPath = selection;
                    closestPath = selection;

                    // Clearing candidates dominated by current solution to speed up the algorithm
                    const trimmedCandidates = [];
                    for (c = 0; c < candidates.length; c += 1) {
                        candidate = candidates[c];
                        if (candidate.w + candidate.d < reachingPath.w) {
                            trimmedCandidates.push(candidate);
                        } else {
                            this.grid[candidate.i][candidate.j].candidateRef = null;
                        }
                    }
                    candidates = trimmedCandidates;
                }
            } else {
                if (selection.d < closestPath.d) {
                    closestPath = selection;
                }
            }
        }
        for (c = 0; c < candidates.length; c++) {
            candidate = candidates[c];
            this.grid[candidate.i][candidate.j].candidateRef = null;
        }
        for (const t of selections) {
            this.grid[t.i][t.j].candidateRef = null;
        }
        for (const cellId of occupiedCells) {
            cellPos = MapPoint.fromCellId(cellId);
            if (!cellPos) {
                continue;
            }
            this.grid[cellPos.x + 1][
                cellPos.y + 1
            ].weight += this.OCCUPIED_CELL_WEIGHT;
        }
        const shortestPath = [];
        while (closestPath !== null) {
            const mp = MapPoint.fromCoords(closestPath.i - 1, closestPath.j - 1);
            if (!mp) {
                continue;
            }
            shortestPath.unshift(mp.cellId);
            closestPath = closestPath.path;
        }
        return shortestPath;
    }
    areCommunicating(c1, c2) {
        if (c1.floor === c2.floor) {
            return true;
        }
        if (c1.zone === c2.zone) {
            return (
                this.oldMovementSystem ||
                c1.zone !== 0 ||
                Math.abs(c1.floor - c2.floor) <= this.ELEVATION_TOLERANCE
            );
        }
        return false;
    }

    addCandidate(
        c,
        weight,
        di,
        dj,
        candidates,
        path
    ) {
        const distanceToDestination = Math.sqrt(
            Math.pow(di - c.i, 2) + Math.pow(dj - c.j, 2)
        );
        weight = weight / c.speed + c.weight;

        if (c.candidateRef === null) {
            const candidateRef = new CellPath(
                c.i,
                c.j,
                path.w + weight,
                distanceToDestination,
                path
            );
            candidates.push(candidateRef);
            c.candidateRef = candidateRef;
        } else {
            const newWeight = path.w + weight;
            if (newWeight < c.candidateRef.w) {
                c.candidateRef.w = newWeight;
                c.candidateRef.path = path;
            }
        }
    }
    canMoveDiagonnalyTo(
        c1,
        c2,
        c3,
        c4
    ) {
        return (
            this.areCommunicating(c1, c2) &&
            (this.areCommunicating(c1, c3) || this.areCommunicating(c1, c4))
        );
    }
    addCandidates(
        path,
        di,
        dj,
        candidates,
        allowDiagonals
    ) {
        const i = path.i;
        const j = path.j;
        const c = this.grid[i][j];

        const c01 = this.grid[i - 1][j];
        const c10 = this.grid[i][j - 1];
        const c12 = this.grid[i][j + 1];
        const c21 = this.grid[i + 1][j];

        if (this.areCommunicating(c, c01)) {
            this.addCandidate(c01, 1, di, dj, candidates, path);
        }
        if (this.areCommunicating(c, c21)) {
            this.addCandidate(c21, 1, di, dj, candidates, path);
        }
        if (this.areCommunicating(c, c10)) {
            this.addCandidate(c10, 1, di, dj, candidates, path);
        }
        if (this.areCommunicating(c, c12)) {
            this.addCandidate(c12, 1, di, dj, candidates, path);
        }

        if (allowDiagonals) {
            const c00 = this.grid[i - 1][j - 1];
            const c02 = this.grid[i - 1][j + 1];
            const c20 = this.grid[i + 1][j - 1];
            const c22 = this.grid[i + 1][j + 1];

            const weightDiagonal = Math.sqrt(2);

            if (this.canMoveDiagonnalyTo(c, c00, c01, c10)) {
                this.addCandidate(c00, weightDiagonal, di, dj, candidates, path);
            }
            if (this.canMoveDiagonnalyTo(c, c20, c21, c10)) {
                this.addCandidate(c20, weightDiagonal, di, dj, candidates, path);
            }
            if (this.canMoveDiagonnalyTo(c, c02, c01, c12)) {
                this.addCandidate(c02, weightDiagonal, di, dj, candidates, path);
            }
            if (this.canMoveDiagonnalyTo(c, c22, c21, c12)) {
                this.addCandidate(c22, weightDiagonal, di, dj, candidates, path);
            }
        }
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