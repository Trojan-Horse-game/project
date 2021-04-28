export default class Card {
    scene: any;
    constructor(scene) {
        this.scene = scene;
    }


    displayCard(x: number, y : number, sprite : any) {
        let card = this.scene.add.image(x, y, sprite).setScale(0.06, 0.06).setInteractive();
        this.scene.input.setDraggable(card);
        return card;
    }
}