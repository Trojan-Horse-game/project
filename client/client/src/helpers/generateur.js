export default class Generateur {
    constructor(scene) {
        this.render = (x, y, sprite) => {
            let generateur = scene.add.image(x, y, sprite).setScale(0.07, 0.07).setInteractive();
            return generateur;
        }

        this.renderZone = () => {
            let generateurDropZone = scene.add.zone(x, y, 100, 100).setRectangleDropZone(100, 100);
            generateurDropZone.setData({ state: 'gris' });
            return generateurDropZone;
        }

        this.renderOutline = (generateurDropZone) => {
            let generateurDropZoneOutline = scene.add.graphics();
            generateurDropZoneOutline.lineStyle(4, 0xcccccc);
            generateurDropZoneOutline.strokeRect(generateurDropZone.x - generateurDropZone.input.hitArea.width / 2, generateurDropZone.y - generateurDropZone.input.hitArea.height / 2, generateurDropZone.input.hitArea.width, generateurDropZone.input.hitArea.height)
            return generateurDropZoneOutline;
        }
    }
}