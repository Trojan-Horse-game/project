export default class Zone {
  scene: any;
  constructor(scene: any) {
    this.scene = scene;
  }

  renderZone(x: number, y: number, w: number, h: number, name: string) {
    let dropZone = this.scene.add.zone(x, y, w, h).setRectangleDropZone(w, h);
    dropZone.setData({ cards: 0 });
    dropZone.setName(name); //ici
    return dropZone;
  }

  renderOutline(dropZone: any) {
    let dropZoneOutline = this.scene.add.graphics();
    dropZoneOutline.lineStyle(4, 0xffffcc);
    dropZoneOutline.strokeRect(
      dropZone.x - dropZone.input.hitArea.width / 2,
      dropZone.y - dropZone.input.hitArea.height / 2,
      dropZone.input.hitArea.width,
      dropZone.input.hitArea.height
    );
    return dropZoneOutline;
  }
}
