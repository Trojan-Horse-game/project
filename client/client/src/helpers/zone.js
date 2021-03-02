export default class Zone {
    constructor(scene) {
        this.renderZone = (name) => {
            let dropZone = scene.add.zone(640, 390, 150, 150).setRectangleDropZone(150, 150);
            dropZone.setData({ cards: 0 });
            dropZone.setName(name); //ici
            return dropZone;
        };
        this.renderOutline = (dropZone) => {
            let dropZoneOutline = scene.add.graphics();
            dropZoneOutline.lineStyle(4, 0xffffcc);
            dropZoneOutline.strokeRect(dropZone.x - dropZone.input.hitArea.width / 2, dropZone.y - dropZone.input.hitArea.height / 2, dropZone.input.hitArea.width, dropZone.input.hitArea.height)
            return dropZoneOutline;
        }
    }
}