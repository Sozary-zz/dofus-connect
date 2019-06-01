import Server from "./server/server"
import Character from "./character/character"
export default class Game {
    constructor(account) {
        this.server = new Server(account)
        this.character = new Character(account)
        // this.map = new Map(account)
        // this.fight = new Fight(account)
        // this.managers = new Managers(
        //     account,
        //     this.map
        // )
        // this.chat = new Chat(account)
        // this.npcs = new Npcs(account)
        // this.storage = new Storage(account)
        // this.exchange = new Exchange(account)
        // this.bid = new Bid(account)
        // this.craft = new Craft(account)
        // this.breeding = new Breeding(account)
        // this.quests = new Quests(account)
    }
    clear() {
        // this.character.clear();
        // this.map.clear();
        // this.fight.clear();
        // this.managers.clear();
        // this.bid.clear();
        // this.breeding.clear();
    }
}