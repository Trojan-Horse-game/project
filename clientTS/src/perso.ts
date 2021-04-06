export default class Perso {
  scene: any;
  playerPosition: number[][] =[];
  constructor(scene: any) {
    this.scene = scene;
  }

  computePosition(PlayersPlaying: number, width: number, height: number) {
    // the first two players are here no matter what
    this.playerPosition.push([width / 4, height - 100]); //position of main player
    this.playerPosition.push([width / 2, 100]); //position 3

    //break as been avoided on purpose for a better memory optimization
    switch (
      PlayersPlaying // total of players playing
    ) {
      case 6:
        this.playerPosition.push([width - 100, 100]); //position 4
      case 5:
        this.playerPosition.push([100, (height / 4) * 3 - 100]); //  position 1
      case 4:
        this.playerPosition.push([100, 120]); //add position 2
      case 3:
        this.playerPosition.push([width - 100, (height / 4) * 3 - 100]); //5 position
      default:
    }
    return this.playerPosition;
  }

  per_ren(x: number, y: number, sprite: any) {
    let personnage = this.scene.add.image(x, y, sprite);
    personnage.displayHeight = 100;
    personnage.displayWidth = 100;
    return personnage;
  }

  per_ren_Nickname(x: number, y: number, name: string) {
    let nickname = this.scene.add
      .text(x, y, name)
      .setFontSize(24)
      .setFontFamily("Trebuchet MS")
      .setColor("#ffffff")
      .setInteractive();
    return nickname;
  }

  per_renderZone(x: number, y: number, name: string) {
    let persoDropZone = this.scene.add.zone(x, y).setCircleDropZone(65);
    persoDropZone.setName(name);
    persoDropZone.setData({ state: "inactif" });
    return persoDropZone;
  }

  per_renderOutline(x: number, y: number, radius: number /*,persoDropZone*/) {
    var persoDropZoneOutline = this.scene.add.graphics();
    persoDropZoneOutline.lineStyle(8, 0x999999);
    persoDropZoneOutline.strokeCircle(
      /*persoDropZone.*/ x,
      /*persoDropZone.*/ y,
      /*persoDropZone.input.hitArea.*/ radius
    );
    return persoDropZoneOutline;
  }

  per_renderZone_nick(x: number, y: number, name: string) {
    let persoDropZone = this.scene.add.zone(x, y); //.setRectangleDropZone(nickname.x +5,nickname.y+5);
    persoDropZone.setName(name);
    persoDropZone.setData({ state: "inactif" });
    return persoDropZone;
  }

  per_renderOutline_nick(x: number, y: number, w: number, h: number) {
    var persoDropZoneOutline = this.scene.add.graphics();
    persoDropZoneOutline.fillStyle(0x999999);
    persoDropZoneOutline.fillRect(x, y, w, h);
    return persoDropZoneOutline;
  }

  // NB: ici j'écris deux fois le prénom, je n'ai pas trouver de solution plus élégante pour que le fond se fit bien au nom
  displayPlayers(
    players: Perso[],
    playerPosition: number[][],
    playerIdx: number,
    sprite: string,
    namePlayers: string[]
  ) {
    players[playerIdx].per_ren(
      playerPosition[playerIdx][0],
      playerPosition[playerIdx][1],
      sprite
    );
    players[playerIdx].per_renderOutline(
      playerPosition[playerIdx][0],
      playerPosition[playerIdx][1],
      65
    );
    let nom = players[playerIdx].per_ren_Nickname(
      playerPosition[playerIdx][0] - 40,
      playerPosition[playerIdx][1] - 100,
      namePlayers[playerIdx]
    );
    players[playerIdx].per_renderOutline_nick(
      nom.x,
      nom.y,
      nom.displayWidth,
      nom.displayHeight
    ); //130, 25);
    players[playerIdx].per_ren_Nickname(
      playerPosition[playerIdx][0] - 40,
      playerPosition[playerIdx][1] - 100,
      namePlayers[playerIdx]
    );
  }
}
