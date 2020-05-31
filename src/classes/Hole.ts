export default class Hole extends Phaser.GameObjects.Zone {
	isCross: boolean;
	constructor(scene: Phaser.Scene, x: number, y: number) {
		const w = scene.textures.getFrame("circle", 0).width;
		const h = scene.textures.getFrame("circle", 0).height;

		super(scene, x, y, w, h / 8);
		this.setOrigin(0.5);
		scene.add.existing(this);
		scene.physics.add.existing(this);
	}
}
