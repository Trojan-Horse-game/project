import Card from '../helpers/card';
import Zone from '../helpers/zone';
import Perso from '../helpers/perso';
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
        const numPlayers = 6;
        let joueurs = [[]];

        let self = this;

        this.dealText = this.add.text(75, 300, ['DEAL CARDS']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00ffff').setInteractive();

        this.dealCards = () => {
            for (let i = 0; i < 3; i++) {
                let playerCard = new Card(this);
                playerCard.render(475 + (i * 180), 670, 'carte_verso');
            }
        }

        this.tas_zone = new Zone(this);
        this.renderZone = this.tas_zone.renderZone("tas");
        this.outline = this.tas_zone.renderOutline(this.renderZone); // return value dropZoneOutline

        this.dealText2 = this.add.text(180, 300, ['DEAL ICONS']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00ffff').setInteractive();

        this.dealIcons = () => {
            //simplification du code a continuer plus tard.           
            //Je crée pour chaque joueur ses 5 générateurs, dans l'ordre suivant : 
            /*  indice 0 : foudre
                indice 1 : air
                indice 2 : goute
                indice 3 : radiation
                indice 4 : super*/
            /*
            for (let i = 0; i < numPlayers; i++) {
                for (let j = 0; j < 5; j++) {
                    joueurs[i][j] = new Generateur(this);                   
                }
            }

            let displayGen = (generator, x, y, sprite, name) =>{
                generator.gen_render(x, y, sprite);
                this.foudre_renZ_1 = generator.gen_renderZone(195, 40, name);
                this.foudre_renO_1 = generator.gen_renderOutline(this.foudre_renZ_1);
            }

            //First player
            displayGen(joueurs[0][0], 195, 40, 'foudre', ("foudre_1" ));
            displayGen(joueurs[0][1], 225,115, 'air', ("air_1" ));
            displayGen(joueurs[0][2], 200, 185, 'goute', ("goute_1" ));
            displayGen(joueurs[0][3], 150, 245, 'radiation', ("radiation_1" ));
            displayGen(joueurs[0][4], 70, 245, 'super', ("super_1" ));

            //2d player
            displayGen(joueurs[0][0], x, y, 'foudre', ("foudre_1" ));
            displayGen(joueurs[0][1], x, y, 'air', ("air_1" ));
            displayGen(joueurs[0][2], x, y, 'goute', ("goute_1" ));
            displayGen(joueurs[0][3], x, y, 'radiation', ("radiation_1" ));
            displayGen(joueurs[0][4], x, y, 'super', ("super_1" ));

            //3rd player
            displayGen(joueurs[0][0], x, y, 'foudre', ("foudre_1" ));
            displayGen(joueurs[0][1], x, y, 'air', ("air_1" ));
            displayGen(joueurs[0][2], x, y, 'goute', ("goute_1" ));
            displayGen(joueurs[0][3], x, y, 'radiation', ("radiation_1" ));
            displayGen(joueurs[0][4], x, y, 'super', ("super_1" ));

            //4th player
            displayGen(joueurs[0][0], x, y, 'foudre', ("foudre_1" ));
            displayGen(joueurs[0][1], x, y, 'air', ("air_1" ));
            displayGen(joueurs[0][2], x, y, 'goute', ("goute_1" ));
            displayGen(joueurs[0][3], x, y, 'radiation', ("radiation_1" ));
            displayGen(joueurs[0][4], x, y, 'super', ("super_1" ));

            //5th player
            displayGen(joueurs[0][0], x, y, 'foudre', ("foudre_1" ));
            displayGen(joueurs[0][1], x, y, 'air', ("air_1" ));
            displayGen(joueurs[0][2], x, y, 'goute', ("goute_1" ));
            displayGen(joueurs[0][3], x, y, 'radiation', ("radiation_1" ));
            displayGen(joueurs[0][4], x, y, 'super', ("super_1" ));
            */

            let foudre_1 = new Generateur(this);
            let air_1 = new Generateur(this);
            let goute_1 = new Generateur(this);
            let radiation_1 = new Generateur(this);
            let super_1 = new Generateur(this);

            foudre_1.gen_render(195, 40, 'foudre');
            this.foudre_renZ_1 = foudre_1.gen_renderZone(195, 40, "foudre_1");
            this.foudre_renO_1 = foudre_1.gen_renderOutline(this.foudre_renZ_1);

            air_1.gen_render(225,115, 'air');
            this.air_renZ_1 = air_1.gen_renderZone(225, 115, "air_1");
            this.air_renO_1 = air_1.gen_renderOutline(this.air_renZ_1);

            goute_1.gen_render(200, 185, 'goute');
            this.goute_renZ_1 = goute_1.gen_renderZone(200, 185, "goute_1");
            this.goute_renO_1 = goute_1.gen_renderOutline(this.goute_renZ_1);

            radiation_1.gen_render(150, 245, 'radiation');
            this.rad_renZ_1 = radiation_1.gen_renderZone(150, 245, "radiation_1");
            this.rad_renO_1 = radiation_1.gen_renderOutline(this.rad_renZ_1);

            super_1.gen_render(70, 245, 'super');
            this.super_renZ_1 = super_1.gen_renderZone(70, 245, "super_1");
            this.super_renO_1 = super_1.gen_renderOutline(this.super_renZ_1);

            let foudre_2 = new Generateur(this);
            let air_2 = new Generateur(this);
            let goute_2 = new Generateur(this);
            let radiation_2 = new Generateur(this);
            let super_2 = new Generateur(this);

            foudre_2.gen_render(1280 - 195, 40, 'foudre');
            this.foudre_renZ_2 = foudre_2.gen_renderZone(1280 - 195, 40, "foudre_2");
            this.foudre_renO_2 = foudre_2.gen_renderOutline(this.foudre_renZ_2);

            air_2.gen_render(1280 - 225, 115, 'air');
            this.air_renZ_2 = air_2.gen_renderZone(1280 - 225, 115, "air_2");
            this.air_renO_2 = air_2.gen_renderOutline(this.air_renZ_2);

            goute_2.gen_render(1280 - 200, 185, 'goute');
            this.goute_renZ_2 = goute_2.gen_renderZone(1280 - 200, 185, "goute_2");
            this.goute_renO_2 = goute_2.gen_renderOutline(this.goute_renZ_2);

            radiation_2.gen_render(1280 - 150, 245, 'radiation');
            this.rad_renZ_2 = radiation_2.gen_renderZone(1280 - 150, 245, "radiation_2");
            this.rad_renO_2 = radiation_2.gen_renderOutline(this.rad_renZ_2);

            super_2.gen_render(1280 - 70, 245, 'super');
            this.super_renZ_2 = super_2.gen_renderZone(1280 - 70, 245, "super_2");
            this.super_renO_2 = super_2.gen_renderOutline(this.super_renZ_2);

            let foudre_3 = new Generateur(this);
            let air_3 = new Generateur(this);
            let goute_3 = new Generateur(this);
            let radiation_3 = new Generateur(this);
            let super_3 = new Generateur(this);

            foudre_3.gen_render(70, 390, 'foudre');
            this.foudre_renZ_3 = foudre_3.gen_renderZone(70, 390, "foudre_3");
            this.foudre_renO_3 = foudre_3.gen_renderOutline(this.foudre_renZ_3);

            air_3.gen_render(150, 400, 'air');
            this.air_renZ_3 = air_3.gen_renderZone(150, 400, "air_3");
            this.air_renO_3 = air_3.gen_renderOutline(this.air_renZ_3);

            goute_3.gen_render(200, 465, 'goute');
            this.goute_renZ_3 = goute_3.gen_renderZone(200, 465, "goute_3");
            this.goute_renO_3 = goute_3.gen_renderOutline(this.goute_renZ_3);

            radiation_3.gen_render(225, 545, 'radiation');
            this.rad_renZ_3 = radiation_3.gen_renderZone(225, 545, "radiation_3");
            this.rad_renO_3 = radiation_3.gen_renderOutline(this.rad_renZ_3);

            super_3.gen_render(195, 625, 'super');
            this.super_renZ_3 = super_3.gen_renderZone(195, 625, "super_3");
            this.super_renO_3 = super_3.gen_renderOutline(this.super_renZ_3);

            let foudre_4 = new Generateur(this);
            let air_4 = new Generateur(this);
            let goute_4 = new Generateur(this);
            let radiation_4 = new Generateur(this);
            let super_4 = new Generateur(this);

            foudre_4.gen_render(1280 - 70, 390, 'foudre');
            this.foudre_renZ_4 = foudre_4.gen_renderZone(1280 - 70, 390, "foudre_4");
            this.foudre_renO_4 = foudre_4.gen_renderOutline(this.foudre_renZ_4);

            air_4.gen_render(1280 - 150, 400, 'air');
            this.air_renZ_4 = air_4.gen_renderZone(1280 - 150, 400, "air_4");
            this.air_renO_4 = air_4.gen_renderOutline(this.air_renZ_4);

            goute_4.gen_render(1280 - 200, 465, 'goute');
            this.goute_renZ_4 = goute_4.gen_renderZone(1280 - 200, 465, "goute_4");
            this.goute_renO_4 = goute_4.gen_renderOutline(this.goute_renZ_4);

            radiation_4.gen_render(1280 - 225, 545, 'radiation');
            this.rad_renZ_4 = radiation_4.gen_renderZone(1280 - 225, 545, "radiation_4");
            this.rad_renO_4 = radiation_4.gen_renderOutline(this.rad_renZ_4);

            super_4.gen_render(1280 - 195, 625, 'super');
            this.super_renZ_4 = super_4.gen_renderZone(1280 - 195, 625, "super_4");
            this.super_renO_4 = super_4.gen_renderOutline(this.super_renZ_4);

            let foudre_5 = new Generateur(this);
            let air_5 = new Generateur(this);
            let goute_5 = new Generateur(this);
            let radiation_5 = new Generateur(this);
            let super_5 = new Generateur(this);

            foudre_5.gen_render(500, 155, 'foudre');
            this.foudre_renZ_5 = foudre_5.gen_renderZone(500, 155, "foudre_5");
            this.foudre_renO_5 = foudre_5.gen_renderOutline(this.foudre_renZ_5);

            air_5.gen_render(560, 210, 'air');
            this.air_renZ_5 = air_5.gen_renderZone(560, 210, "air_5");
            this.air_renO_5 = air_5.gen_renderOutline(this.air_renZ_5);

            goute_5.gen_render(640, 245, 'goute');
            this.goute_renZ_5 = goute_5.gen_renderZone(640, 245, "goute_5");
            this.goute_renO_5 = goute_5.gen_renderOutline(this.goute_renZ_5);

            radiation_5.gen_render(720, 210, 'radiation');
            this.rad_renZ_5 = radiation_5.gen_renderZone(720, 210, "radiation_5");
            this.rad_renO_5 = radiation_5.gen_renderOutline(this.rad_renZ_5);

            super_5.gen_render(780, 155, 'super');
            this.super_renZ_5 = super_5.gen_renderZone(780, 155, "super_5");
            this.super_renO_5 = super_5.gen_renderOutline(this.super_renZ_5);

            let foudre_6 = new Generateur(this);
            let air_6 = new Generateur(this);
            let goute_6 = new Generateur(this);
            let radiation_6 = new Generateur(this);
            let super_6 = new Generateur(this);

            foudre_6.gen_render(440, 780 - 270, 'foudre');
            this.foudre_renZ_6 = foudre_6.gen_renderZone(440, 780 - 270, "foudre_6");
            this.foudre_renO_6 = foudre_6.gen_renderOutline(this.foudre_renZ_6);

            air_6.gen_render(540, 780 - 270, 'air');
            this.air_renZ_6 = air_6.gen_renderZone(540, 780 - 270, "air_6");
            this.air_renO_6 = air_6.gen_renderOutline(this.air_renZ_6);

            goute_6.gen_render(640, 780 - 270, 'goute');
            this.goute_renZ_6 = goute_6.gen_renderZone(640, 780 - 270, "goute_6");
            this.goute_renO_6 = goute_6.gen_renderOutline(this.goute_renZ_6);

            radiation_6.gen_render(740, 780 - 270, 'radiation');
            this.rad_renZ_6 = radiation_6.gen_renderZone(740, 780 - 270, "radiation_6");
            this.rad_renO_6 = radiation_6.gen_renderOutline(this.rad_renZ_6);

            super_6.gen_render(840, 780 - 270, 'super');
            this.super_renZ_6 = super_6.gen_renderZone(840, 780 - 270, "super_6");
            this.super_renO_6 = super_6.gen_renderOutline(this.super_renZ_6);
        }

        //Ic�nes joueurs avec nicknames
        let perso_1 = new Perso(this);
        let perso_2 = new Perso(this);
        let perso_3 = new Perso(this);
        let perso_4 = new Perso(this);
        let perso_5 = new Perso(this);
        let perso_6 = new Perso(this);

        perso_1.per_ren(100, 120, 'fawkes');
//        this.nick_1 = perso_1.per_ren_Nickname(65, 20, "SIHAM");
//        this.renZ_perso_1 = perso_1.per_renderZone(100, 120, "perso_1");
        this.renO_perso_1 = perso_1.per_renderOutline(100, 120, 65/*this.renZ_perso_1*/);
//        this.renZ_nick_perso_1 = perso_1.per_renderZone_nick(65, 20, "perso_1"/*,this.nick_1*/);
        this.renO_nick_perso_1 = perso_1.per_renderOutline_nick(37,20/*this.renZ_nick_perso_1*/, 115, 25);
        this.nick_1 = perso_1.per_ren_Nickname(65, 20, "SIHAM");


        //this.renZ_perso_2
        //this.renZ_perso_3
        //this.renZ_perso_4
        //this.renZ_perso_5
        //this.renZ_perso_6

        perso_2.per_ren(1200, 120, 'hutex');
        this.nick_2 = perso_2.per_ren_Nickname(1150, 20, "NICOLAS");
/*        this.renZ_perso_2 = perso_2.per_renderZone(1190, 120, "perso_2");
        this.renO_perso_2 = perso_2.per_renderOutline(this.renZ_perso_2);
        this.renZ_nick_perso_2 = perso_2.per_renderZone_nick(1150, 20, "perso_2",this.nick_2);
        this.renO_nick_perso_2 = perso_2.per_renderOutline_nick(this.renZ_nick_perso_2, 120, 25);
        this.nick_2 = perso_2.per_ren_Nickname(1150, 20, "NICOLAS");*/

        perso_3.per_ren(640, 120, 'robotec');
        perso_1.per_ren_Nickname(600, 40, "TREVOR", perso_1);

        perso_4.per_ren(1200, 500, 'spectre');
        perso_1.per_ren_Nickname(1150, 560, "HAKIM", perso_1);

        perso_5.per_ren(100, 500, 'totox');
        perso_1.per_ren_Nickname(65, 560, "AGHILAS", perso_1);

        perso_6.per_ren(320, 660, 'xmars');
        perso_6.per_ren_Nickname(300, 740, "ISA");

 

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
                self.foudre_renO_1.clear();
                self.foudre_renO_1.lineStyle(4, 0xff66ff);
                self.foudre_renO_1.strokeCircle(self.foudre_renZ_1.x, self.foudre_renZ_1.y, self.foudre_renZ_1.input.hitArea.radius);
            }
            if (dropZone.name == "air_1") {
                self.air_renO_1.clear();
                self.air_renO_1.lineStyle(4, 0xff66ff);
                self.air_renO_1.strokeCircle(self.air_renZ_1.x, self.air_renZ_1.y, self.air_renZ_1.input.hitArea.radius);
            }
            if (dropZone.name == "goute_1") {
                self.goute_renO_1.clear();
                self.goute_renO_1.lineStyle(4, 0xff66ff);
                self.goute_renO_1.strokeCircle(self.goute_renZ_1.x, self.goute_renZ_1.y, self.goute_renZ_1.input.hitArea.radius);
            }
            if (dropZone.name == "radiation_1") {
                self.rad_renO_1.clear();
                self.rad_renO_1.lineStyle(4, 0xff66ff);
                self.rad_renO_1.strokeCircle(self.rad_renZ_1.x, self.rad_renZ_1.y, self.rad_renZ_1.input.hitArea.radius);
            }
            if (dropZone.name == "super_1") {
                self.super_renO_1.clear();
                self.super_renO_1.lineStyle(4, 0xff66ff);
                self.super_renO_1.strokeCircle(self.super_renZ_1.x, self.super_renZ_1.y, self.super_renZ_1.input.hitArea.radius);
            }
            if (dropZone.name == "foudre_2") {
                self.foudre_renO_2.clear();
                self.foudre_renO_2.lineStyle(4, 0xff66ff);
                self.foudre_renO_2.strokeCircle(self.foudre_renZ_2.x, self.foudre_renZ_2.y, self.foudre_renZ_2.input.hitArea.radius);
            }
            if (dropZone.name == "air_2") {
                self.air_renO_2.clear();
                self.air_renO_2.lineStyle(4, 0xff66ff);
                self.air_renO_2.strokeCircle(self.air_renZ_2.x, self.air_renZ_2.y, self.air_renZ_2.input.hitArea.radius);
            }
            if (dropZone.name == "goute_2") {
                self.goute_renO_2.clear();
                self.goute_renO_2.lineStyle(4, 0xff66ff);
                self.goute_renO_2.strokeCircle(self.goute_renZ_2.x, self.goute_renZ_2.y, self.goute_renZ_2.input.hitArea.radius);
            }
            if (dropZone.name == "radiation_2") {
                self.rad_renO_2.clear();
                self.rad_renO_2.lineStyle(4, 0xff66ff);
                self.rad_renO_2.strokeCircle(self.rad_renZ_2.x, self.rad_renZ_2.y, self.rad_renZ_2.input.hitArea.radius);
            }
            if (dropZone.name == "super_2") {
                self.super_renO_2.clear();
                self.super_renO_2.lineStyle(4, 0xff66ff);
                self.super_renO_2.strokeCircle(self.super_renZ_2.x, self.super_renZ_2.y, self.super_renZ_2.input.hitArea.radius);
            }
            if (dropZone.name == "foudre_3") {
                self.foudre_renO_3.clear();
                self.foudre_renO_3.lineStyle(4, 0xff66ff);
                self.foudre_renO_3.strokeCircle(self.foudre_renZ_3.x, self.foudre_renZ_3.y, self.foudre_renZ_3.input.hitArea.radius);
            }
            if (dropZone.name == "air_3") {
                self.air_renO_3.clear();
                self.air_renO_3.lineStyle(4, 0xff66ff);
                self.air_renO_3.strokeCircle(self.air_renZ_3.x, self.air_renZ_3.y, self.air_renZ_3.input.hitArea.radius);
            }
            if (dropZone.name == "goute_3") {
                self.goute_renO_3.clear();
                self.goute_renO_3.lineStyle(4, 0xff66ff);
                self.goute_renO_3.strokeCircle(self.goute_renZ_3.x, self.goute_renZ_3.y, self.goute_renZ_3.input.hitArea.radius);
            }
            if (dropZone.name == "radiation_3") {
                self.rad_renO_3.clear();
                self.rad_renO_3.lineStyle(4, 0xff66ff);
                self.rad_renO_3.strokeCircle(self.rad_renZ_3.x, self.rad_renZ_3.y, self.rad_renZ_3.input.hitArea.radius);
            }
            if (dropZone.name == "super_3") {
                self.super_renO_3.clear();
                self.super_renO_3.lineStyle(4, 0xff66ff);
                self.super_renO_3.strokeCircle(self.super_renZ_3.x, self.super_renZ_3.y, self.super_renZ_3.input.hitArea.radius);
            }
            if (dropZone.name == "foudre_4") {
                self.foudre_renO_4.clear();
                self.foudre_renO_4.lineStyle(4, 0xff66ff);
                self.foudre_renO_4.strokeCircle(self.foudre_renZ_4.x, self.foudre_renZ_4.y, self.foudre_renZ_4.input.hitArea.radius);
            }
            if (dropZone.name == "air_4") {
                self.air_renO_4.clear();
                self.air_renO_4.lineStyle(4, 0xff66ff);
                self.air_renO_4.strokeCircle(self.air_renZ_4.x, self.air_renZ_4.y, self.air_renZ_4.input.hitArea.radius);
            }
            if (dropZone.name == "goute_4") {
                self.goute_renO_4.clear();
                self.goute_renO_4.lineStyle(4, 0xff66ff);
                self.goute_renO_4.strokeCircle(self.goute_renZ_4.x, self.goute_renZ_4.y, self.goute_renZ_4.input.hitArea.radius);
            }
            if (dropZone.name == "radiation_4") {
                self.rad_renO_4.clear();
                self.rad_renO_4.lineStyle(4, 0xff66ff);
                self.rad_renO_4.strokeCircle(self.rad_renZ_4.x, self.rad_renZ_4.y, self.rad_renZ_4.input.hitArea.radius);
            }
            if (dropZone.name == "super_4") {
                self.super_renO_4.clear();
                self.super_renO_4.lineStyle(4, 0xff66ff);
                self.super_renO_4.strokeCircle(self.super_renZ_4.x, self.super_renZ_4.y, self.super_renZ_4.input.hitArea.radius);
            }
            if (dropZone.name == "foudre_5") {
                self.foudre_renO_5.clear();
                self.foudre_renO_5.lineStyle(4, 0xff66ff);
                self.foudre_renO_5.strokeCircle(self.foudre_renZ_5.x, self.foudre_renZ_5.y, self.foudre_renZ_5.input.hitArea.radius);
            }
            if (dropZone.name == "air_5") {
                self.air_renO_5.clear();
                self.air_renO_5.lineStyle(4, 0xff66ff);
                self.air_renO_5.strokeCircle(self.air_renZ_5.x, self.air_renZ_5.y, self.air_renZ_5.input.hitArea.radius);
            }
            if (dropZone.name == "goute_5") {
                self.goute_renO_5.clear();
                self.goute_renO_5.lineStyle(4, 0xff66ff);
                self.goute_renO_5.strokeCircle(self.goute_renZ_5.x, self.goute_renZ_5.y, self.goute_renZ_5.input.hitArea.radius);
            }
            if (dropZone.name == "radiation_5") {
                self.rad_renO_5.clear();
                self.rad_renO_5.lineStyle(4, 0xff66ff);
                self.rad_renO_5.strokeCircle(self.rad_renZ_5.x, self.rad_renZ_5.y, self.rad_renZ_5.input.hitArea.radius);
            }
            if (dropZone.name == "super_5") {
                self.super_renO_5.clear();
                self.super_renO_5.lineStyle(4, 0xff66ff);
                self.super_renO_5.strokeCircle(self.super_renZ_5.x, self.super_renZ_5.y, self.super_renZ_5.input.hitArea.radius);
            }
            if (dropZone.name == "foudre_6") {
                self.foudre_renO_6.clear();
                self.foudre_renO_6.lineStyle(4, 0xff66ff);
                self.foudre_renO_6.strokeCircle(self.foudre_renZ_6.x, self.foudre_renZ_6.y, self.foudre_renZ_6.input.hitArea.radius);
            }
            if (dropZone.name == "air_6") {
                self.air_renO_6.clear();
                self.air_renO_6.lineStyle(4, 0xff66ff);
                self.air_renO_6.strokeCircle(self.air_renZ_6.x, self.air_renZ_6.y, self.air_renZ_6.input.hitArea.radius);
            }
            if (dropZone.name == "goute_6") {
                self.goute_renO_6.clear();
                self.goute_renO_6.lineStyle(4, 0xff66ff);
                self.goute_renO_6.strokeCircle(self.goute_renZ_6.x, self.goute_renZ_6.y, self.goute_renZ_6.input.hitArea.radius);
            }
            if (dropZone.name == "radiation_6") {
                self.rad_renO_6.clear();
                self.rad_renO_6.lineStyle(4, 0xff66ff);
                self.rad_renO_6.strokeCircle(self.rad_renZ_6.x, self.rad_renZ_6.y, self.rad_renZ_6.input.hitArea.radius);
            }
            if (dropZone.name == "super_6") {
                self.super_renO_6.clear();
                self.super_renO_6.lineStyle(4, 0xff66ff);
                self.super_renO_6.strokeCircle(self.super_renZ_6.x, self.super_renZ_6.y, self.super_renZ_6.input.hitArea.radius);
            }
        })

        this.input.on('dragleave', function (pointer, gameObject, dropZone) {
            if (dropZone.name == "tas") {
                self.outline.clear();
                self.outline.lineStyle(4, 0xff3399);
                self.outline.strokeRect(self.renderZone.x - self.renderZone.input.hitArea.width / 2, self.renderZone.y - self.renderZone.input.hitArea.height / 2, self.renderZone.input.hitArea.width, self.renderZone.input.hitArea.height);
            }
            if (dropZone.name == "foudre_1") {
                self.foudre_renO_1.clear();
                self.foudre_renO_1.lineStyle(4, 0xff3399);
                self.foudre_renO_1.strokeCircle(self.foudre_renZ_1.x, self.foudre_renZ_1.y, self.foudre_renZ_1.input.hitArea.radius);
            }
            if (dropZone.name == "air_1") {
                self.air_renO_1.clear();
                self.air_renO_1.lineStyle(4, 0xff3399);
                self.air_renO_1.strokeCircle(self.air_renZ_1.x, self.air_renZ_1.y, self.air_renZ_1.input.hitArea.radius);
            }
            if (dropZone.name == "goute_1") {
                self.goute_renO_1.clear();
                self.goute_renO_1.lineStyle(4, 0xff3399);
                self.goute_renO_1.strokeCircle(self.goute_renZ_1.x, self.goute_renZ_1.y, self.goute_renZ_1.input.hitArea.radius);
            }
            if (dropZone.name == "radiation_1") {
                self.rad_renO_1.clear();
                self.rad_renO_1.lineStyle(4, 0xff3399);
                self.rad_renO_1.strokeCircle(self.rad_renZ_1.x, self.rad_renZ_1.y, self.rad_renZ_1.input.hitArea.radius);
            }
            if (dropZone.name == "super_1") {
                self.super_renO_1.clear();
                self.super_renO_1.lineStyle(4, 0xff3399);
                self.super_renO_1.strokeCircle(self.super_renZ_1.x, self.super_renZ_1.y, self.super_renZ_1.input.hitArea.radius);
            }
            if (dropZone.name == "foudre_2") {
                self.foudre_renO_2.clear();
                self.foudre_renO_2.lineStyle(4, 0xff3399);
                self.foudre_renO_2.strokeCircle(self.foudre_renZ_2.x, self.foudre_renZ_2.y, self.foudre_renZ_2.input.hitArea.radius);
            }
            if (dropZone.name == "air_2") {
                self.air_renO_2.clear();
                self.air_renO_2.lineStyle(4, 0xff3399);
                self.air_renO_2.strokeCircle(self.air_renZ_2.x, self.air_renZ_2.y, self.air_renZ_2.input.hitArea.radius);
            }
            if (dropZone.name == "goute_2") {
                self.goute_renO_2.clear();
                self.goute_renO_2.lineStyle(4, 0xff3399);
                self.goute_renO_2.strokeCircle(self.goute_renZ_2.x, self.goute_renZ_2.y, self.goute_renZ_2.input.hitArea.radius);
            }
            if (dropZone.name == "radiation_2") {
                self.rad_renO_2.clear();
                self.rad_renO_2.lineStyle(4, 0xff3399);
                self.rad_renO_2.strokeCircle(self.rad_renZ_2.x, self.rad_renZ_2.y, self.rad_renZ_2.input.hitArea.radius);
            }
            if (dropZone.name == "super_2") {
                self.super_renO_2.clear();
                self.super_renO_2.lineStyle(4, 0xff3399);
                self.super_renO_2.strokeCircle(self.super_renZ_2.x, self.super_renZ_2.y, self.super_renZ_2.input.hitArea.radius);
            }
            if (dropZone.name == "foudre_3") {
                self.foudre_renO_3.clear();
                self.foudre_renO_3.lineStyle(4, 0xff3399);
                self.foudre_renO_3.strokeCircle(self.foudre_renZ_3.x, self.foudre_renZ_3.y, self.foudre_renZ_3.input.hitArea.radius);
            }
            if (dropZone.name == "air_3") {
                self.air_renO_3.clear();
                self.air_renO_3.lineStyle(4, 0xff3399);
                self.air_renO_3.strokeCircle(self.air_renZ_3.x, self.air_renZ_3.y, self.air_renZ_3.input.hitArea.radius);
            }
            if (dropZone.name == "goute_3") {
                self.goute_renO_3.clear();
                self.goute_renO_3.lineStyle(4, 0xff3399);
                self.goute_renO_3.strokeCircle(self.goute_renZ_3.x, self.goute_renZ_3.y, self.goute_renZ_3.input.hitArea.radius);
            }
            if (dropZone.name == "radiation_3") {
                self.rad_renO_3.clear();
                self.rad_renO_3.lineStyle(4, 0xff3399);
                self.rad_renO_3.strokeCircle(self.rad_renZ_3.x, self.rad_renZ_3.y, self.rad_renZ_3.input.hitArea.radius);
            }
            if (dropZone.name == "super_3") {
                self.super_renO_3.clear();
                self.super_renO_3.lineStyle(4, 0xff3399);
                self.super_renO_3.strokeCircle(self.super_renZ_3.x, self.super_renZ_3.y, self.super_renZ_3.input.hitArea.radius);
            }
            if (dropZone.name == "foudre_4") {
                self.foudre_renO_4.clear();
                self.foudre_renO_4.lineStyle(4, 0xff3399);
                self.foudre_renO_4.strokeCircle(self.foudre_renZ_4.x, self.foudre_renZ_4.y, self.foudre_renZ_4.input.hitArea.radius);
            }
            if (dropZone.name == "air_4") {
                self.air_renO_4.clear();
                self.air_renO_4.lineStyle(4, 0xff3399);
                self.air_renO_4.strokeCircle(self.air_renZ_4.x, self.air_renZ_4.y, self.air_renZ_4.input.hitArea.radius);
            }
            if (dropZone.name == "goute_4") {
                self.goute_renO_4.clear();
                self.goute_renO_4.lineStyle(4, 0xff3399);
                self.goute_renO_4.strokeCircle(self.goute_renZ_4.x, self.goute_renZ_4.y, self.goute_renZ_4.input.hitArea.radius);
            }
            if (dropZone.name == "radiation_4") {
                self.rad_renO_4.clear();
                self.rad_renO_4.lineStyle(4, 0xff3399);
                self.rad_renO_4.strokeCircle(self.rad_renZ_4.x, self.rad_renZ_4.y, self.rad_renZ_4.input.hitArea.radius);
            }
            if (dropZone.name == "super_4") {
                self.super_renO_4.clear();
                self.super_renO_4.lineStyle(4, 0xff3399);
                self.super_renO_4.strokeCircle(self.super_renZ_4.x, self.super_renZ_4.y, self.super_renZ_4.input.hitArea.radius);
            }
            if (dropZone.name == "foudre_5") {
                self.foudre_renO_5.clear();
                self.foudre_renO_5.lineStyle(4, 0xff3399);
                self.foudre_renO_5.strokeCircle(self.foudre_renZ_5.x, self.foudre_renZ_5.y, self.foudre_renZ_5.input.hitArea.radius);
            }
            if (dropZone.name == "air_5") {
                self.air_renO_5.clear();
                self.air_renO_5.lineStyle(4, 0xff3399);
                self.air_renO_5.strokeCircle(self.air_renZ_5.x, self.air_renZ_5.y, self.air_renZ_5.input.hitArea.radius);
            }
            if (dropZone.name == "goute_5") {
                self.goute_renO_5.clear();
                self.goute_renO_5.lineStyle(4, 0xff3399);
                self.goute_renO_5.strokeCircle(self.goute_renZ_5.x, self.goute_renZ_5.y, self.goute_renZ_5.input.hitArea.radius);
            }
            if (dropZone.name == "radiation_5") {
                self.rad_renO_5.clear();
                self.rad_renO_5.lineStyle(4, 0xff3399);
                self.rad_renO_5.strokeCircle(self.rad_renZ_5.x, self.rad_renZ_5.y, self.rad_renZ_5.input.hitArea.radius);
            }
            if (dropZone.name == "super_5") {
                self.super_renO_5.clear();
                self.super_renO_5.lineStyle(4, 0xff3399);
                self.super_renO_5.strokeCircle(self.super_renZ_5.x, self.super_renZ_5.y, self.super_renZ_5.input.hitArea.radius);
            }
            if (dropZone.name == "foudre_6") {
                self.foudre_renO_6.clear();
                self.foudre_renO_6.lineStyle(4, 0xff3399);
                self.foudre_renO_6.strokeCircle(self.foudre_renZ_6.x, self.foudre_renZ_6.y, self.foudre_renZ_6.input.hitArea.radius);
            }
            if (dropZone.name == "air_6") {
                self.air_renO_6.clear();
                self.air_renO_6.lineStyle(4, 0xff3399);
                self.air_renO_6.strokeCircle(self.air_renZ_6.x, self.air_renZ_6.y, self.air_renZ_6.input.hitArea.radius);
            }
            if (dropZone.name == "goute_6") {
                self.goute_renO_6.clear();
                self.goute_renO_6.lineStyle(4, 0xff3399);
                self.goute_renO_6.strokeCircle(self.goute_renZ_6.x, self.goute_renZ_6.y, self.goute_renZ_6.input.hitArea.radius);
            }
            if (dropZone.name == "radiation_6") {
                self.rad_renO_6.clear();
                self.rad_renO_6.lineStyle(4, 0xff3399);
                self.rad_renO_6.strokeCircle(self.rad_renZ_6.x, self.rad_renZ_6.y, self.rad_renZ_6.input.hitArea.radius);
            }
            if (dropZone.name == "super_6") {
                self.super_renO_6.clear();
                self.super_renO_6.lineStyle(4, 0xff3399);
                self.super_renO_6.strokeCircle(self.super_renZ_6.x, self.super_renZ_6.y, self.super_renZ_6.input.hitArea.radius);
            }
        })

        this.input.on('dragend', function (pointer, gameObject, dropped) {
            gameObject.setTint();
            gameObject.setScale(0.05);
            if (!dropped) {
                gameObject.x = gameObject.input.dragStartX;
                gameObject.y = gameObject.input.dragStartY;
                gameObject.setScale(0.06);
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
            if (dropZone.name == "foudre_2") {
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                gameObject.disableInteractive();
                gameObject.setTint(0x3399ff);
            }
            if (dropZone.name == "air_2") {
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                gameObject.disableInteractive();
                gameObject.setTint(0x3399ff);
            }
            if (dropZone.name == "goute_2") {
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                gameObject.disableInteractive();
                gameObject.setTint(0x3399ff);
            }
            if (dropZone.name == "radiation_2") {
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                gameObject.disableInteractive();
                gameObject.setTint(0x3399ff);
            }
            if (dropZone.name == "super_2") {
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                gameObject.disableInteractive();
                gameObject.setTint(0x3399ff);
            }
            if (dropZone.name == "foudre_3") {
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                gameObject.disableInteractive();
                gameObject.setTint(0x3399ff);
            }
            if (dropZone.name == "air_3") {
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                gameObject.disableInteractive();
                gameObject.setTint(0x3399ff);
            }
            if (dropZone.name == "goute_3") {
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                gameObject.disableInteractive();
                gameObject.setTint(0x3399ff);
            }
            if (dropZone.name == "radiation_3") {
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                gameObject.disableInteractive();
                gameObject.setTint(0x3399ff);
            }
            if (dropZone.name == "super_3") {
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                gameObject.disableInteractive();
                gameObject.setTint(0x3399ff);
            }
            if (dropZone.name == "foudre_4") {
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                gameObject.disableInteractive();
                gameObject.setTint(0x3399ff);
            }
            if (dropZone.name == "air_4") {
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                gameObject.disableInteractive();
                gameObject.setTint(0x3399ff);
            }
            if (dropZone.name == "goute_4") {
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                gameObject.disableInteractive();
                gameObject.setTint(0x3399ff);
            }
            if (dropZone.name == "radiation_4") {
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                gameObject.disableInteractive();
                gameObject.setTint(0x3399ff);
            }
            if (dropZone.name == "super_4") {
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                gameObject.disableInteractive();
                gameObject.setTint(0x3399ff);
            }
            if (dropZone.name == "foudre_5") {
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                gameObject.disableInteractive();
                gameObject.setTint(0x3399ff);
            }
            if (dropZone.name == "air_5") {
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                gameObject.disableInteractive();
                gameObject.setTint(0x3399ff);
            }
            if (dropZone.name == "goute_5") {
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                gameObject.disableInteractive();
                gameObject.setTint(0x3399ff);
            }
            if (dropZone.name == "radiation_5") {
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                gameObject.disableInteractive();
                gameObject.setTint(0x3399ff);
            }
            if (dropZone.name == "super_5") {
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                gameObject.disableInteractive();
                gameObject.setTint(0x3399ff);
            }
            if (dropZone.name == "foudre_6") {
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                gameObject.disableInteractive();
                gameObject.setTint(0x3399ff);
            }
            if (dropZone.name == "air_6") {
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                gameObject.disableInteractive();
                gameObject.setTint(0x3399ff);
            }
            if (dropZone.name == "goute_6") {
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                gameObject.disableInteractive();
                gameObject.setTint(0x3399ff);
            }
            if (dropZone.name == "radiation_6") {
                gameObject.x = dropZone.x;
                gameObject.y = dropZone.y;
                gameObject.disableInteractive();
                gameObject.setTint(0x3399ff);
            }
            if (dropZone.name == "super_6") {
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