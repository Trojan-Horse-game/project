import "phaser";

export class PlayerSlot extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene,
                playerCircleRadius: number,
                slotLayout: SlotLayout,
                name: string,
                texture: string) {
        super(scene);
        let layoutInfo = new LayoutInfo(slotLayout)
        let profilePicture = new PlayerProfilePicture(scene, playerCircleRadius, texture);
        this.add(profilePicture);
        
        let nameText = this.scene.add.text(0, 0, name.toUpperCase());
        nameText.setOrigin(0.5, layoutInfo.textYOrigin);
        nameText.setY(layoutInfo.textYPositionFactor * playerCircleRadius);
        nameText.setFontSize(playerCircleRadius * 0.27);
        nameText.setFontFamily("sans-serif");
        let padding = playerCircleRadius * 0.0857
        nameText.setPadding(padding, padding, padding, padding);
        nameText.style.setAlign("center");
        nameText.style.setColor("FFFFFF");
        nameText.style.setBackgroundColor("555455");
        this.add(nameText);

        // TODO: replace the circles with the actual generators
        for (let i = 0; i < 5; i++) {
            let generatorInfo = layoutInfo.generatorRotationBuilder(i)

            let basePivot = this.scene.add.container()
            let subPivot = this.scene.add.container()
            let circle = this.scene.add.graphics()
            
            circle.fillStyle(0xE61B84)
            circle.fillCircle(0, 0, 30)
            subPivot.setY(-115)
            circle.setY(generatorInfo.yOffsetFactor * playerCircleRadius)
            
            basePivot.rotation = generatorInfo.rotation
            subPivot.rotation = -generatorInfo.rotation
            subPivot.add(circle)
            basePivot.add(subPivot)
            this.add(basePivot)
        }
    }
}

class PlayerProfilePicture extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene, radius: number, texture: string) {
        super(scene);
        let strokeWidth = radius * 0.15;
        let innerStrokeWidth = strokeWidth / 1.7;

        // Create and add image
        let image = this.scene.add.image(0, 0, texture);
        let imageSize = (radius * 2) - strokeWidth;
        image.displayWidth = imageSize;
        image.displayHeight = imageSize;
        this.add(image)

        // Create borders
        let graphics = this.scene.add.graphics();
        
        graphics.lineStyle(innerStrokeWidth, 0x0);
        graphics.strokeCircle(0, 0, radius-innerStrokeWidth);
        graphics.lineStyle(strokeWidth, 0x565455);
        graphics.strokeCircle(0, 0, radius);
        this.add(graphics);
    }
}

export enum SlotLayout {
    BottomLeft, TopLeft, Middle, TopRight, BottomRight
}

class LayoutInfo {
    constructor(slotLayout: SlotLayout) {
        switch (slotLayout) {
            case SlotLayout.BottomLeft:
                this.textYOrigin = 0;
                this.textYPositionFactor = LayoutInfo.baseYPositionFactor;
                this.generatorRotationBuilder = LayoutInfo.makeGenPosBuild(-0.174,0.62,4)
                break;
            case SlotLayout.BottomRight:
                this.textYOrigin = 0;
                this.textYPositionFactor = LayoutInfo.baseYPositionFactor;
                this.generatorRotationBuilder = LayoutInfo.makeGenPosBuild(-2.306,0.62,0)
                break;
            case SlotLayout.TopLeft:
                this.textYOrigin = 1;
                this.textYPositionFactor = -LayoutInfo.baseYPositionFactor;
                this.generatorRotationBuilder = LayoutInfo.makeGenPosBuild(0.875,0.7);
                break;
            case SlotLayout.TopRight:
                this.textYOrigin = 1;
                this.textYPositionFactor = -LayoutInfo.baseYPositionFactor;
                this.generatorRotationBuilder = LayoutInfo.makeGenPosBuild(-3.675,0.7);
                break;
            case SlotLayout.Middle:
                this.textYOrigin = 1;
                this.textYPositionFactor = -LayoutInfo.baseYPositionFactor;
                this.generatorRotationBuilder = LayoutInfo.makeGenPosBuild(1.3089,0.9162);
                break;
        }
    }

    textYOrigin: number;
    textYPositionFactor: number;
    generatorRotationBuilder: (index: number)=>(GeneratorPosition);

    static baseYPositionFactor: number = 1.15;

    static makeGenPosBuild(start: number,
                          increment: number,
                          offsetIndex?: number): (index: number)=>(GeneratorPosition) {
        return (index: number): GeneratorPosition => {
            if (offsetIndex == undefined || offsetIndex != index) {
                
                return new GeneratorPosition(start + increment * index, 0)
            } else {
                let builder = LayoutInfo.makeGenPosBuild(start, increment, offsetIndex)
                let last = builder(offsetIndex == 0 ? index+1 : index-1)
                return new GeneratorPosition(last.rotation, 1.05)
            }
        }
    }

    static deg2rad(degrees: number): number {
        return (degrees * Math.PI) / 180
    }

}

class GeneratorPosition {
    constructor(rotation: number, yOffsetFactor: number) {
        this.rotation = rotation
        this.yOffsetFactor = yOffsetFactor
    }
    rotation: number
    yOffsetFactor: number
}