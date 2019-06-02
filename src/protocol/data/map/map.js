import AtlasLayout from "./atlaslayout"
export default class _Map {
    constructor(
        id,
        topNeighbourId,
        bottomNeighbourId,
        leftNeighbourId,
        rightNeighbourId
    ) {
        this.id = id
        this.topNeighbourId = topNeighbourId
        this.bottomNeighbourId = bottomNeighbourId
        this.leftNeighbourId = leftNeighbourId
        this.rightNeighbourId = rightNeighbourId
        this.cells = []
        this.midgroundLayer = new Map()
        this.atlasLayout = new AtlasLayout();
    }
}