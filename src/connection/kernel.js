import {
    GameConst
} from './gameConst'

export default class Kernel {
    async main() {
        let gameConst = new GameConst()
        this.data = await gameConst.init()
    }
    getData() {
        return this.data
    }


}