import { Point } from "../scenes/GameScene";
export default class Player extends Phaser.GameObjects.Image {
	isCross: boolean;

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y, "circle");

		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.isCross = false;
		this.setInteractive().on("pointerdown", () => {
			this.isCross = !this.isCross;
			if (this.isCross) {
				this.setTexture("cross");
			} else {
				this.setTexture("circle");
			}
		});
	}

	move(position: number) {
		const tween = this.scene.tweens.add({
			targets: this,
			x: { from: this.x, to: position },
			duration: 100,
			ease: "cubic.inout",
			repeat: 0,
			onComplete: () => {
				tween.remove();
			},
			onCompleteScope: this.scene,
		});
	}
}
