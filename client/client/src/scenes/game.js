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

        this.zone = new Zone(this);
        this.renderZone = this.zone.renderZone();
        this.outline = this.zone.renderOutline(this.renderZone); // return value dropZoneOutline

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
            gameObject.setTint(0x6666ff);
            this.children.bringToTop(gameObject);
        }, this)

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
            gameObject.setTint(0xccffff);
        })

        this.input.on('dragenter', function (pointer, gameObject, dropZone) {
            self.outline.clear();
            self.outline.lineStyle(4, 0xff66ff);
            self.outline.strokeRect(self.renderZone.x - self.renderZone.input.hitArea.width / 2, self.renderZone.y - self.renderZone.input.hitArea.height / 2, self.renderZone.input.hitArea.width, self.renderZone.input.hitArea.height);
        })
        this.input.on('dragleave', function (pointer, gameObject, dropZone) {
            self.outline.clear();
            self.outline.lineStyle(4, 0xff3399);
            self.outline.strokeRect(self.renderZone.x - self.renderZone.input.hitArea.width / 2, self.renderZone.y - self.renderZone.input.hitArea.height / 2, self.renderZone.input.hitArea.width, self.renderZone.input.hitArea.height);
        })

        this.input.on('dragend', function (pointer, gameObject, dropped) {
            gameObject.setTint();
            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
            }
        })

        this.input.on('drop', function (pointer, gameObject, dropZone) {
            dropZone.data.values.cards++;
            gameObject.x = dropZone.x;
            gameObject.y = dropZone.y;
            gameObject.setScale(0.05);
            gameObject.disableInteractive();
        })

        this.dealText2 = this.add.text(175, 450, ['DEAL GENERATEURS']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00ffff').setInteractive();

        this.dealIcons = () => {
            for (let i = 0; i < numPlayers; i++) {
                let generateur = new Generateur(this);
                generateur.render(100 + (i * 100), 180 + (i * 100), 'foudre')
                    .renderZone = this.zone.renderZone()
                        .outline = this.zone.renderOutline(this.renderZone);
                generateur.render(200 + (i * 100), 650, 'air')
                    .renderZone = this.zone.renderZone()
                        .outline = this.zone.renderOutline(this.renderZone);
                generateur.render(300 + (i * 100), 650, 'goute')
                    .renderZone = this.zone.renderZone()
                        .outline = this.zone.renderOutline(this.renderZone);
                generateur.render(400 + (i * 100), 650, 'radiation')
                    .renderZone = this.zone.renderZone()
                        .outline = this.zone.renderOutline(this.renderZone);
                generateur.render(500 + (i * 100), 650, 'super')
                    .renderZone = this.zone.renderZone()
                        .outline = this.zone.renderOutline(this.renderZone);
            }
        }

        this.dealText2.on('pointerdown', function () {
            self.dealIcons();
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