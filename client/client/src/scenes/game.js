import Card from '../helpers/card';
import Zone from '../helpers/zone';
import Generateur from '../helpers/generateur';

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Game'
        });
    }



    preload() {
        this.load.image('background', 'src/assets/stars_background.jpg');
        this.load.image('carte_verso', 'src/assets/carte_verso.png');

        this.load.image('foudre', 'src/assets/foudre_log.png');
        this.load.image('air', 'src/assets/air_log.png');
        this.load.image('goute', 'src/assets/goute_log.png');
        this.load.image('radiation', 'src/assets/radiation_log.png');
        this.load.image('super', 'src/assets/super_log.png');

        this.load.image('fawkes', 'src/assets/Fawkes.png');
        this.load.image('hutex', 'src/assets/Hutex.png');
        this.load.image('robotec', 'src/assets/Robotec.png');
        this.load.image('spectre', 'src/assets/Spectre.png');
        this.load.image('totox', 'src/assets/Totox.png');
        this.load.image('xmars', 'src/assets/Xmars.png');
    }

    create() {

        const bg = this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(1.09);
        const numPlayers = 1;

        let self = this;

        this.dealText = this.add.text(75, 350, ['DEAL CARDS']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00ffff').setInteractive();

        this.dealCards = () => {
            for (let i = 0; i < 3; i++) {
                let playerCard = new Card(this);
                playerCard.render(475 + (i * 200), 650, 'carte_verso');
            }
        }

        this.tas_zone = new Zone(this);
        this.renderZone = this.tas_zone.renderZone("tas");
        this.outline = this.tas_zone.renderOutline(this.renderZone); // return value dropZoneOutline

        this.dealText2 = this.add.text(175, 450, ['DEAL ICONS']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00ffff').setInteractive();

        this.dealIcons = () => {
            let foudre_1 = new Generateur(this);
            let air_1 = new Generateur(this);
            let goute_1 = new Generateur(this);
            let radiation_1 = new Generateur(this);
            let super_1 = new Generateur(this);

            foudre_1.gen_render(195, 40, 'foudre');
            this.foudre_ren_z = foudre_1.gen_renderZone(195, 40, "foudre_1", foudre_1);
            this.foudre_ren_out = foudre_1.gen_renderOutline(this.foudre_ren_z);

            air_1.gen_render(225,115, 'air');
            this.air_ren_z = air_1.gen_renderZone(225, 115, "air_1", air_1);
            this.air_ren_out = air_1.gen_renderOutline(this.air_ren_z);

            goute_1.gen_render(200, 185, 'goute');
            this.goute_ren_z = goute_1.gen_renderZone(200, 185, "goute_1", goute_1);
            this.goute_ren_out = goute_1.gen_renderOutline(this.goute_ren_z);

            radiation_1.gen_render(150, 245, 'radiation');
            this.rad_ren_z = radiation_1.gen_renderZone(150, 245, "radiation_1", radiation_1);
            this.rad_ren_out = radiation_1.gen_renderOutline(this.rad_ren_z);

            super_1.gen_render(70, 245, 'super');
            this.super_ren_z = super_1.gen_renderZone(70, 245, "super_1", super_1);
            this.super_ren_out = super_1.gen_renderOutline(this.super_ren_z);

        }

        this.dealText.on('pointerdown', function () {
            self.dealCards();
        })

        this.dealText.on('pointerover', function () {
            self.dealText.setColor('#ff69b4');
        })

        this.dealText.on('pointerout', function () {
            self.dealText.setColor('#00ffff');
        })

        this.input.on('dragstart', function (pointer, gameObject) {
            gameObject.setTint(0xccffff);
            this.children.bringToTop(gameObject);
        }, this)

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
            gameObject.setTint(0xccffff);
            gameObject.setScale(0.01);
        })

        this.input.on('dragenter', function (pointer, gameObject, dropZone) {
            if (dropZone.name == "tas") {
                self.outline.clear();
                self.outline.lineStyle(4, 0xff66ff);
                self.outline.strokeRect(self.renderZone.x - self.renderZone.input.hitArea.width / 2, self.renderZone.y - self.renderZone.input.hitArea.height / 2, self.renderZone.input.hitArea.width, self.renderZone.input.hitArea.height);  
            }
            if (dropZone.name == "foudre_1") {
                self.foudre_ren_out.clear();
                self.foudre_ren_out.lineStyle(4, 0xff66ff);
                self.foudre_ren_out.strokeCircle(self.foudre_ren_z.x, self.foudre_ren_z.y, self.foudre_ren_z.input.hitArea.radius);
            }
            if (dropZone.name == "air_1") {
                self.air_ren_out.clear();
                self.air_ren_out.lineStyle(4, 0xff66ff);
                self.air_ren_out.strokeCircle(self.air_ren_z.x, self.air_ren_z.y, self.air_ren_z.input.hitArea.radius);
            }
            if (dropZone.name == "goute_1") {
                self.goute_ren_out.clear();
                self.goute_ren_out.lineStyle(4, 0xff66ff);
                self.goute_ren_out.strokeCircle(self.goute_ren_z.x, self.goute_ren_z.y, self.goute_ren_z.input.hitArea.radius);
            }
            if (dropZone.name == "radiation_1") {
                self.rad_ren_out.clear();
                self.rad_ren_out.lineStyle(4, 0xff66ff);
                self.rad_ren_out.strokeCircle(self.rad_ren_z.x, self.rad_ren_z.y, self.rad_ren_z.input.hitArea.radius);
            }
            if (dropZone.name == "super_1") {
                self.super_ren_out.clear();
                self.super_ren_out.lineStyle(4, 0xff66ff);
                self.super_ren_out.strokeCircle(self.super_ren_z.x, self.super_ren_z.y, self.super_ren_z.input.hitArea.radius);
            }

        })
        this.input.on('dragleave', function (pointer, gameObject, dropZone) {
            if (dropZone.name == "tas") {
                self.outline.clear();
                self.outline.lineStyle(4, 0xff3399);
                self.outline.strokeRect(self.renderZone.x - self.renderZone.input.hitArea.width / 2, self.renderZone.y - self.renderZone.input.hitArea.height / 2, self.renderZone.input.hitArea.width, self.renderZone.input.hitArea.height);
            }
            if (dropZone.name == "foudre_1") {
                self.foudre_ren_out.clear();
                self.foudre_ren_out.lineStyle(4, 0xff3399);
                self.foudre_ren_out.strokeCircle(self.foudre_ren_z.x, self.foudre_ren_z.y, self.foudre_ren_z.input.hitArea.radius);
            }
            if (dropZone.name == "air_1") {
                self.air_ren_out.clear();
                self.air_ren_out.lineStyle(4, 0xff3399);
                self.air_ren_out.strokeCircle(self.air_ren_z.x, self.air_ren_z.y, self.air_ren_z.input.hitArea.radius);
            }
            if (dropZone.name == "goute_1") {
                self.goute_ren_out.clear();
                self.goute_ren_out.lineStyle(4, 0xff3399);
                self.goute_ren_out.strokeCircle(self.goute_ren_z.x, self.goute_ren_z.y, self.goute_ren_z.input.hitArea.radius);
            }
            if (dropZone.name == "radiation_1") {
                self.rad_ren_out.clear();
                self.rad_ren_out.lineStyle(4, 0xff3399);
                self.rad_ren_out.strokeCircle(self.rad_ren_z.x, self.rad_ren_z.y, self.rad_ren_z.input.hitArea.radius);
            }
            if (dropZone.name == "super_1") {
                self.super_ren_out.clear();
                self.super_ren_out.lineStyle(4, 0xff3399);
                self.super_ren_out.strokeCircle(self.super_ren_z.x, self.super_ren_z.y, self.super_ren_z.input.hitArea.radius);
            }
        })

        this.input.on('dragend', function (pointer, gameObject, dropped) {
            gameObject.setTint();
            gameObject.setScale(0.05);
            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
                gameObject.setScale(0.07);
            }
        })

        this.input.on('drop', function (pointer, gameObject, dropZone) {
            if (dropZone.name == "tas") {
                dropZone.data.values.cards++;
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                gameObject.disableInteractive();
            }
            if (dropZone.name == "foudre_1") {
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                gameObject.disableInteractive();
                gameObject.setTint(0x3399ff);
            }
            if (dropZone.name == "air_1") {
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                gameObject.disableInteractive();
                gameObject.setTint(0x3399ff);
            }
            if (dropZone.name == "goute_1") {
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                gameObject.disableInteractive();
                gameObject.setTint(0x3399ff);
            }
            if (dropZone.name == "radiation_1") {
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                gameObject.disableInteractive();
                gameObject.setTint(0x3399ff);
            }
            if (dropZone.name == "super_1") {
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                gameObject.disableInteractive();
                gameObject.setTint(0x3399ff);
            }
        })

        this.dealText2.on('pointerdown', function () {
            self.dealIcons();
        })

        this.dealText2.on('pointerover', function () {
            self.dealText2.setColor('#ff69b4');
        })

        this.dealText2.on('pointerout', function () {
            self.dealText2.setColor('#00ffff');
        })

        //var sprite_air = this.add.sprite(100, 100, 'air', {
        //    maskType: 'roundRectangle',
        //    radius: 20
        //}).setOrigin(0, 0).setScale(0.07);
        //sprite_air.setInteractive(new Phaser.Geom.Rectangle(0, 0, 900, 900), Phaser.Geom.Rectangle.Contains);
        //this.input.enableDebug(sprite_air);
        //this.input.on('gameobjectover', function (pointer, gameObject) {
        //    gameObject.setTint(4, 0x66ffff);
        //});
        //this.input.on('gameobjectout', function (pointer, gameObject) {
        //    gameObject.clearTint();
        //});

        //sprite_air.on('drag', function (pointer, dragX, dragY) {
        //    sprite_air.x = dragX;
        //    sprite_air.y = dragY;
        //});


    }

    update() {

    }
}