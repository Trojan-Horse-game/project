export default class Perso {
    constructor(scene) {
        this.per_ren = (x, y, sprite) => {
            let personnage = scene.add.image(x, y, sprite);
            personnage.displayHeight = 100;
            personnage.displayWidth = 100;
            return personnage;
        }
        this.per_ren_Nickname = (x, y, name) => {
            let nickname = scene.add.text(x, y, name).setFontSize(24).setFontFamily('Trebuchet MS').setColor('#ffffff').setInteractive();
            return nickname;
        }
        this.per_renderZone = (x, y, name) => {
            let persoDropZone = scene.add.zone(x, y).setCircleDropZone(65);
            persoDropZone.setName(name);
            persoDropZone.setData({ state: 'inactif' });
            return persoDropZone;
        }

        this.per_renderOutline = (persoDropZone) => {
            var persoDropZoneOutline = scene.add.graphics();
            persoDropZoneOutline.lineStyle(8, 0x999999);
            persoDropZoneOutline.strokeCircle(persoDropZone.x, persoDropZone.y, persoDropZone.input.hitArea.radius);
            return persoDropZoneOutline;
        }

        this.per_renderZone_nick = (x, y,name, nickname) => {
            let persoDropZone = scene.add.zone(x, y).setRectangleDropZone(nickname.x,nickname.y);
            persoDropZone.setName(name);
            persoDropZone.setData({ state: 'inactif' });
            return persoDropZone;
        }

        this.per_renderOutline_nick = (persoDropZone) => {
            var persoDropZoneOutline = scene.add.graphics();
            persoDropZoneOutline.fillStyle(0x999999);
            persoDropZoneOutline.fillRect(persoDropZone.x - persoDropZone.input.hitArea.width / 2, persoDropZone.y - persoDropZone.input.hitArea.height / 2, persoDropZone.input.hitArea.width, persoDropZone.input.hitArea.height);
            persoDropZoneOutline.strokeRect(persoDropZone.x - persoDropZone.input.hitArea.width / 2, persoDropZone.y - persoDropZone.input.hitArea.height / 2, persoDropZone.input.hitArea.width, persoDropZone.input.hitArea.height);
            return persoDropZoneOutline;
        }
    }
}