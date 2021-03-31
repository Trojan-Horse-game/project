export default class Perso {
    scene: any ;

    constructor(scene: any) {
        this.scene = scene;
    }

    per_ren (x : number, y : number, sprite : any) {
        let personnage = this.scene.add.image(x, y, sprite);
        personnage.displayHeight = 100;
        personnage.displayWidth = 100; 
        return personnage;
    }

    per_ren_Nickname (x: number, y: number, name : string) {
        let nickname = this.scene.add.text(x, y, name).setFontSize(24).setFontFamily('Trebuchet MS').setColor('#ffffff').setInteractive();
        return nickname;
    }

    per_renderZone (x: number, y: number, name: string) {
        let persoDropZone = this.scene.add.zone(x, y).setCircleDropZone(65);
        persoDropZone.setName(name);
        persoDropZone.setData({ state: 'inactif' });
        return persoDropZone;
    }

    per_renderOutline (x :number, y: number , radius: number/*,persoDropZone*/) {
        var persoDropZoneOutline = this.scene.add.graphics();
        persoDropZoneOutline.lineStyle(8, 0x999999);
        persoDropZoneOutline.strokeCircle(/*persoDropZone.*/x, /*persoDropZone.*/y, /*persoDropZone.input.hitArea.*/radius);
        return persoDropZoneOutline;
    }

    per_renderZone_nick (x : number, y : number, name : string) {
        let persoDropZone = this.scene.add.zone(x, y);//.setRectangleDropZone(nickname.x +5,nickname.y+5);
        persoDropZone.setName(name);
        persoDropZone.setData({ state: 'inactif' });
        return persoDropZone;
    }

    per_renderOutline_nick (x,y/*persoDropZone*/,w,h) {
        var persoDropZoneOutline = this.scene.add.graphics();
        persoDropZoneOutline.fillStyle(0x999999);
        persoDropZoneOutline.fillRect(/*persoDropZone.*/x,/*persoDropZone.*/y,w,h/*persoDropZone.x - persoDropZone.input.hitArea.width / 2, persoDropZone.y - persoDropZone.input.hitArea.height / 2, persoDropZone.input.hitArea.width, persoDropZone.input.hitArea.height*/);
        persoDropZoneOutline.strokeRect(/*persoDropZone.*/x,/*persoDropZone.*/y,w,h/*persoDropZone.x - persoDropZone.input.hitArea.width / 2, persoDropZone.y - persoDropZone.input.hitArea.height / 2, persoDropZone.input.hitArea.width, persoDropZone.input.hitArea.height*/);
        return persoDropZoneOutline;
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