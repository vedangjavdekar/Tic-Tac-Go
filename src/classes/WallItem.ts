export default class WallItem extends Phaser.GameObjects.Image {
	isCross: boolean;
	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y, "circle");

		scene.add.existing(this);
		scene.physics.add.existing(this);
	}

	/**
	 * Used to change the symbol image shown on screen.
	 * @param isCross change texture to cross
	 */
	changeSymbol(isCross: boolean) {
		if (this.isCross != isCross) {
			if (isCross) {
				this.setTexture("cross");
				this.isCross = true;
			} else {
				this.setTexture("circle");
				this.isCross = false;
			}
		}
	}
}
