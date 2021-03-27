export default class Card {
    
    constructor() {
    }


    render(x: number, y : number, sprite : image) {
        let card = scene.add.image(x, y, sprite).setScale(0.06, 0.06).setInteractive();
        scene.input.setDraggable(card);
        return card;
    }
}