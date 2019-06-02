export default class Cell {
    constructor(
        l,
        f,
        c,
        s,
        z
    ) {
        this.l = l
        this.f = f
        this.c = c
        this.s = s
        this.z = z
    }
    isWalkable(isFightMode = false) {
        if (!this.l) {
            return false;
        }
        return (this.l & (isFightMode ? 5 : 1)) === 1;
    }

    isFarmCell() {
        if (!this.l) {
            return false;
        }
        return (this.l & 32) === 32;
    }

    isVisible() {
        if (!this.l) {
            return false;
        }
        return (this.l & 64) === 64;
    }

    isObstacle() {
        if (!this.l) {
            return false;
        }
        return (this.l & 2) !== 2;
    }
}