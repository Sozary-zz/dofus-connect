export default class MovableEntity {
    UpdateGameMapMovementMessage(message) {
        this.cellId = message.keyMovements[message.keyMovements.length - 1];
    }
}