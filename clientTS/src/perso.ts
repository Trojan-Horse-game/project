export default class Perso {
  scene: Phaser.Scene;
  persWidth = 100;
  persHeight = 100;

  constructor(scene: any) {
    this.scene = scene;
  }

  per_ren(x: number, y: number, sprite: string): Phaser.GameObjects.Image {
    const personnage: Phaser.GameObjects.Image = this.scene.add.image(
      x,
      y,
      sprite
    );
    personnage.displayHeight = this.persHeight;
    personnage.displayWidth = this.persWidth;
    return personnage;
  }

  per_ren_Nickname(
    x: number,
    y: number,
    name: string
  ): Phaser.GameObjects.Text {
    return this.scene.add
      .text(x, y, name)
      .setFontSize(24)
      .setFontFamily("Trebuchet MS")
      .setColor("#ffffff")
      .setInteractive();
  }

  per_renderZone(x: number, y: number, name: string): Phaser.GameObjects.Zone {
    return this.scene.add
      .zone(x, y, this.persWidth, this.persHeight)
      .setCircleDropZone(65)
      .setName(name)
      .setData({ state: "inactif" });
  }

  per_renderOutline(
    x: number,
    y: number,
    radius: number /*,persoDropZone*/
  ): Phaser.GameObjects.Graphics {
    return this.scene.add
      .graphics()
      .lineStyle(8, 0x999999)
      .strokeCircle(
        /*persoDropZone.*/ x,
        /*persoDropZone.*/ y,
        /*persoDropZone.input.hitArea.*/ radius
      );
  }

  per_renderZone_nick(
    x: number,
    y: number,
    name: string
  ): Phaser.GameObjects.Zone {
    return this.scene.add
      .zone(x, y, this.persWidth, this.persHeight)
      .setName(name)
      .setData({ state: "inactif" }); //.setRectangleDropZone(nickname.x +5,nickname.y+5);
  }

  per_renderOutline_nick(
    x: number,
    y: number /*persoDropZone*/,
    width: number,
    height: number
  ) {
    return this.scene.add
      .graphics()
      .fillStyle(0x999999)
      .fillRect(
        /*persoDropZone.*/ x,
        /*persoDropZone.*/ y,
        width,
        height /*persoDropZone.x - persoDropZone.input.hitArea.width / 2, persoDropZone.y - persoDropZone.input.hitArea.height / 2, persoDropZone.input.hitArea.width, persoDropZone.input.hitArea.height*/
      )
      .strokeRect(
        /*persoDropZone.*/ x,
        /*persoDropZone.*/ y,
        width,
        height /*persoDropZone.x - persoDropZone.input.hitArea.width / 2, persoDropZone.y - persoDropZone.input.hitArea.height / 2, persoDropZone.input.hitArea.width, persoDropZone.input.hitArea.height*/
      );
  }

  //    displayPlayer (xImage: number, yImage: number, image: string, radiusCircle: number, xName: number, yName: number, widthName: number, heightName: number,name: string) {
  //       perso_1.per_ren(xImage, yImage, image);
  //        this.nick_1 = perso_1.per_ren_Nickname(65, 20, "SIHAM");
  //        this.renZ_perso_1 = perso_1.per_renderZone(100, 120, "perso_1");
  //        this.renO_perso_1 = perso_1.per_renderOutline(xImage, yImage, radiusCircle/*this.renZ_perso_1*/);
  //        this.renZ_nick_perso_1 = perso_1.per_renderZone_nick(65, 20, "perso_1"/*,this.nick_1*/);
  //        this.renO_nick_perso_1 = perso_1.per_renderOutline_nick((xName +10)/2, yName/*this.renZ_nick_perso_1*/, widthName, heightName);
  //        this.nick_1 = perso_1.per_ren_Nickname(xName, yName, name);
  //    }
}
