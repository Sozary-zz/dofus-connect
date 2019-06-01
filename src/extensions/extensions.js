import FightsExtension from "./fights/fightextension"
export default class Extensions {
    constructor(account) {
        this.fights = new FightsExtension(account);
    }

    clear() {
        this.fights.clear();

    }
}