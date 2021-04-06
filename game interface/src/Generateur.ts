export default class Generateur {
  scene: any;
  index : number;
  constructor(scene: any, index:number) {
    this.scene = scene;
    this.index = index;
  }
  gen_render(x: number, y: number, sprite: any) {
    let generateur = this.scene.add
      .image(x, y, sprite)
      .setScale(0.07, 0.07)
      .setInteractive();
    return generateur;
  }

  gen_renderZone(x: number, y: number, name: string) {
    let generateurDropZone = this.scene.add.zone(x, y).setCircleDropZone(35);
    generateurDropZone.setName(name);
    generateurDropZone.setData({ state: "inactif", zoneType: "generateur",idx: this.index});
    return generateurDropZone;
  }

  gen_renderOutline(generateurDropZone: any) {
    var generateurDropZoneOutline = this.scene.add.graphics();
    generateurDropZoneOutline.lineStyle(4, 0x999999);
    generateurDropZoneOutline.setData({type : "generateur", idx: this.index});
    generateurDropZoneOutline.strokeCircle(
      generateurDropZone.x,
      generateurDropZone.y,
      generateurDropZone.input.hitArea.radius
    );

    return generateurDropZoneOutline;
  }
  displayGenerator(x: number, y: number, sprite: string, name: string) {
    this.gen_render(x, y, sprite);
    let foudre_renZ_1 = this.gen_renderZone(x, y, name);
    let graphics = this.gen_renderOutline(foudre_renZ_1);
    return graphics;
  }
}
