export default class Perso {
    constructor() {
    }

    per_ren (x : number, y : number, sprite : any) {
        let personnage = scene.add.image(x, y, sprite);
        personnage.displayHeight = 100;
        personnage.displayWidth = 100;
        return personnage;
    }

    per_ren_Nickname (x: number, y: number, name : string) {
        let nickname = scene.add.text(x, y, name).setFontSize(24).setFontFamily('Trebuchet MS').setColor('#ffffff').setInteractive();
        return nickname;
    }

    per_renderZone (x: number, y: number, name : string) {
        let persoDropZone = scene.add.zone(x, y).setCircleDropZone(65);
        persoDropZone.setName(name);
        persoDropZone.setData({ state: 'inactif' });
        return persoDropZone;
    }

    this.per_renderOutline = (x :number, y: number , radius/*,persoDropZone*/) => {
        var persoDropZoneOutline = scene.add.graphics();
        persoDropZoneOutline.lineStyle(8, 0x999999);
        persoDropZoneOutline.strokeCircle(/*persoDropZone.*/x, /*persoDropZone.*/y, /*persoDropZone.input.hitArea.*/radius);
        return persoDropZoneOutline;
    }

    this.per_renderZone_nick = (x, y,name) => {
        let persoDropZone = scene.add.zone(x, y);//.setRectangleDropZone(nickname.x +5,nickname.y+5);
        persoDropZone.setName(name);
        persoDropZone.setData({ state: 'inactif' });
        return persoDropZone;
    }

    this.per_renderOutline_nick = (x,y/*persoDropZone*/,w,h) => {
        var persoDropZoneOutline = scene.add.graphics();
        persoDropZoneOutline.fillStyle(0x999999);
        persoDropZoneOutline.fillRect(/*persoDropZone.*/x,/*persoDropZone.*/y,w,h/*persoDropZone.x - persoDropZone.input.hitArea.width / 2, persoDropZone.y - persoDropZone.input.hitArea.height / 2, persoDropZone.input.hitArea.width, persoDropZone.input.hitArea.height*/);
        persoDropZoneOutline.strokeRect(/*persoDropZone.*/x,/*persoDropZone.*/y,w,h/*persoDropZone.x - persoDropZone.input.hitArea.width / 2, persoDropZone.y - persoDropZone.input.hitArea.height / 2, persoDropZone.input.hitArea.width, persoDropZone.input.hitArea.height*/);
        return persoDropZoneOutline;
    }

    this.displayPlayer = (xImage,yImage, xName, yName,radiusCircle, widthName,heightName) => {
    perso_1.per_ren(xImage, ymage, 'fawkes');
    this.renO_perso_1 = perso_1.per_renderOutline(xName, yName, radiusCircle);
    this.renO_nick_perso_1 = perso_1.per_renderOutline_nick(37,20, 115, 25);
    this.nick_1 = perso_1.per_ren_Nickname(65, 20, "SIHAM");
    }