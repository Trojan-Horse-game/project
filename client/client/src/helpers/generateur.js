export default class Generateur {
    constructor(scene) {
        this.gen_render = (x, y, sprite) => {
            let generateur = scene.add.image(x, y, sprite).setScale(0.07, 0.07).setInteractive();
            return generateur;
        }

        this.gen_renderZone = (x, y, name) => {
            let generateurDropZone = scene.add.zone(x, y).setCircleDropZone(35);
            generateurDropZone.setName(name);
            generateurDropZone.setData({ state: 'inactif' });
            return generateurDropZone;
        }

        this.gen_renderOutline = (generateurDropZone) => {
            var generateurDropZoneOutline = scene.add.graphics();
            generateurDropZoneOutline.lineStyle(4, 0x999999);
            generateurDropZoneOutline.strokeCircle(generateurDropZone.x, generateurDropZone.y, generateurDropZone.input.hitArea.radius);
            return generateurDropZoneOutline;
        }
    }
}