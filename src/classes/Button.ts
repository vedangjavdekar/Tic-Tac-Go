import { eventCallback, getFontSize } from "../config";

// Custom Button Class
export default class Button extends Phaser.GameObjects.Container {
	buttonImage: Phaser.GameObjects.Image;
	buttonText: Phaser.GameObjects.Text;
	buttonZone: Phaser.GameObjects.Zone;
	canClick: boolean;
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		text: string,
		textSize: number,
		wide: boolean,
		clickOnce: boolean,
		pointerDownCallback: eventCallback
	) {
		super(scene, x, y);

		this.canClick = true;
		if (wide) {
			this.buttonImage = scene.add.image(0, 0, "buttonwide");
		} else {
			this.buttonImage = scene.add.image(0, 0, "button");
		}
		this.buttonText = scene.add
			.text(0, 0, text, {
				font: `${getFontSize(textSize)}px Megrim`,
				fill: "#232323",
			})
			.setOrigin(0.5);
		this.buttonZone = scene.add
			.zone(0, 0, this.buttonImage.width, this.buttonImage.height)
			.setOrigin(0.5)
			.setInteractive();

		this.add([this.buttonZone, this.buttonImage, this.buttonText]);
		scene.add.existing(this);
		this.buttonZone.on("pointerover", () => {
			if (clickOnce) {
				if (!this.canClick) return;
			}
			this.buttonText.setColor("#fff");
			const tween = scene.tweens.addCounter({
				from: 1,
				to: 0,
				duration: 200,
				ease: "cubic.out",
				onUpdate: () => {
					this.buttonImage.setScale(tween.getValue(), 1);
				},
				onComplete: () => {
					tween.remove();
				},
			});
		});

		this.buttonZone.on("pointerout", () => {
			if (clickOnce) {
				if (!this.canClick) return;
			}
			this.buttonText.setColor("#232323");
			const tween = scene.tweens.addCounter({
				from: 0,
				to: 1,
				duration: 200,
				ease: "cubic.in",
				onUpdate: () => {
					this.buttonImage.setScale(tween.getValue(), 1);
				},
				onComplete: () => {
					tween.remove();
				},
			});
		});

		this.buttonZone.on("pointerdown", () => {
			if (clickOnce) {
				if (!this.canClick) return;
				this.canClick = false;
			}
			this.buttonText.setColor("#232323");
			const tween = scene.tweens.addCounter({
				from: 0,
				to: 1,
				duration: 200,
				ease: "cubic.in",
				onUpdate: () => {
					this.buttonImage.setScale(tween.getValue(), 1);
				},
				onComplete: () => {
					tween.remove();
					pointerDownCallback();
				},
				onCompleteScope: scene,
			});
		});
	}
}
