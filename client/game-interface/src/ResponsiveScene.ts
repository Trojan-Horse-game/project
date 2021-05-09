import "phaser";

export class ResponsiveScene extends Phaser.Scene {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  resize(width: number, height: number) {
    console.error("Method must be overriden");
  }
}
