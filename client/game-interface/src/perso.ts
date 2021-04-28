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

    per_renderOutline_nick (x: number, y: number, w: number, h: number) {
        var persoDropZoneOutline = this.scene.add.graphics();
        persoDropZoneOutline.fillStyle(0x999999);
        persoDropZoneOutline.fillRect(x,y,w,h);
        return persoDropZoneOutline;
    }

// NB: ici j'écris deux fois le prénom, je n'ai pas trouver de solution plus élégante pour que le fond se fit bien au nom
    displayPlayers (players: Perso[], playerPosition: number [][], playerIdx: number, sprite: string, namePlayers: string[]) {
        players[playerIdx].per_ren(playerPosition[playerIdx][0], playerPosition[playerIdx][1], sprite);
        players[playerIdx].per_renderOutline(playerPosition[playerIdx][0], playerPosition[playerIdx][1], 65);
        let nom = players[playerIdx].per_ren_Nickname(playerPosition[playerIdx][0] - 40 , playerPosition[playerIdx][1] - 100, namePlayers[playerIdx]);
        players[playerIdx].per_renderOutline_nick(nom.x , nom.y  , nom.displayWidth , nom.displayHeight);//130, 25);
        players[playerIdx].per_ren_Nickname(playerPosition[playerIdx][0] - 40 , playerPosition[playerIdx][1] - 100, namePlayers[playerIdx]);
    }
    
}