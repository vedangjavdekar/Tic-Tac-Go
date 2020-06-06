import { SCENES, getFontSize, DEFAULT_FONT_SIZE } from "../config";

//TO DO
export default class Tutorial extends Phaser.Scene {
	currentIndex: number = 0;
	canClick: boolean = true;
	constructor() {
		super(SCENES.TUTORIAL);
	}

	create() {
		console.log("in tutorial");
		const width = this.game.canvas.width;
		const height = this.game.canvas.height;

		const panel = this.add
			.image(width / 2, height, "uipanel")
			.setOrigin(0.5, 1);
		const Title = this.add
			.text(width / 2, 0, "Tutorial", {
				font: `${getFontSize(56)}px Megrim`,
				fill: "#fff",
			})
			.setOrigin(0.5, 0);

		//Parent Container
		const parentContainer = this.add.container(0, 0);

		//Tutorial containers
		//#region CONTAINER1 BASIC CONTROLS
		const container1 = this.add.container(width / 2, height / 2);
		container1.add(
			this.add
				.text(
					0,
					Title.height + height / 12 - height / 2,
					"Basic Controls",
					{
						font: `${getFontSize(DEFAULT_FONT_SIZE)}px Megrim`,
						fill: "#fff",
					}
				)
				.setAlign("center")
				.setOrigin(0.5)
		);
		container1.add(
			this.add
				.text(0, height / 3 - height / 2, "tap to move your symbol", {
					font: `${getFontSize(24)}px Megrim`,
					fill: "#fff",
				})
				.setOrigin(0.5)
				.setAlign("center")
				.setWordWrapWidth(width)
		);

		const hand = this.add.image(-width / 4, 0, "hand");
		const circle = this.add.image(-width / 4, height / 6, "circle");
		container1.add(hand);
		container1.add(circle);
		const timeline1 = this.tweens.createTimeline({ ease: "cubic.inout" });
		timeline1.add({
			targets: hand,
			duration: 500,
			x: { from: -width / 4, to: width / 4 },
			onComplete: () => {
				this.tweens.add({
					targets: circle,
					delay: 200,
					duration: 100,
					x: { from: -width / 4, to: width / 4 },
					onComplete: (tween: Phaser.Tweens.Tween) => {
						tween.remove();
					},
				});
				this.time.delayedCall(200, () => {
					hand.setTexture("handtouched");
				});
				this.time.delayedCall(500, () => {
					hand.setTexture("hand");
				});
			},
		});

		timeline1.add({
			delay: 1000,
			targets: hand,
			duration: 500,
			x: { from: width / 4, to: -width / 4 },
			onComplete: () => {
				this.tweens.add({
					targets: circle,
					delay: 200,
					duration: 100,
					x: { from: width / 4, to: -width / 4 },
					onComplete: (tween: Phaser.Tweens.Tween) => {
						tween.remove();
					},
				});
				this.time.delayedCall(200, () => {
					hand.setTexture("handtouched");
				});
				this.time.delayedCall(500, () => {
					hand.setTexture("hand");
				});
			},
		});
		timeline1.loopDelay = 1000;
		timeline1.loop = -1;
		timeline1.play();
		parentContainer.add(container1);
		//#endregion

		//#region CONTAINER2 CHANGE SYMBOL
		const container2 = this.add.container(
			1 * width + width / 2,
			height / 2
		);
		container2.add(
			this.add
				.text(
					0,
					Title.height + height / 12 - height / 2,
					"Basic Controls",
					{
						font: `${getFontSize(DEFAULT_FONT_SIZE)}px Megrim`,
						fill: "#fff",
					}
				)
				.setAlign("center")
				.setOrigin(0.5)
		);
		container2.add(
			this.add
				.text(
					0,
					height / 3 - height / 2,
					"tap on the symbol to change",
					{
						font: `${getFontSize(24)}px Megrim`,
						fill: "#fff",
					}
				)
				.setOrigin(0.5)
				.setAlign("center")
				.setWordWrapWidth(width)
		);
		const changeObject = this.add.image(0, 0, "circle");
		const tapHand = this.add.image(20, height / 6, "hand");

		container2.add(changeObject);
		container2.add(tapHand);
		const timeline2 = this.tweens.createTimeline();

		timeline2.add({
			duration: 500,
			targets: tapHand,
			y: { from: height / 6, to: height / 24 },
			onComplete: () => {
				tapHand.setTexture("handtouched");
				changeObject.setTexture("cross");
				this.time.delayedCall(100, () => {
					tapHand.setTexture("hand");
				});
			},
		});
		timeline2.add({
			delay: 200,
			duration: 500,
			targets: tapHand,
			y: { from: height / 24, to: height / 6 },
			onComplete: () => {},
		});

		timeline2.add({
			delay: 1000,
			duration: 500,
			targets: tapHand,
			y: { from: height / 6, to: height / 24 },
			onComplete: () => {
				tapHand.setTexture("handtouched");
				changeObject.setTexture("circle");
				this.time.delayedCall(100, () => {
					tapHand.setTexture("hand");
				});
			},
		});
		timeline2.add({
			delay: 200,
			duration: 500,
			targets: tapHand,
			y: { from: height / 24, to: height / 6 },
			onComplete: () => {},
		});
		timeline2.loop = -1;
		timeline2.loopDelay = 1000;
		timeline2.play();
		parentContainer.add(container2);
		//#endregion

		//#region CONTAINER2 POINTS
		const container3 = this.add.container(
			2 * width + width / 2,
			height / 2
		);
		container3.add(
			this.add
				.text(0, Title.height + height / 12 - height / 2, "Points", {
					font: `${getFontSize(DEFAULT_FONT_SIZE)}px Megrim`,
					fill: "#fff",
				})
				.setAlign("center")
				.setOrigin(0.5)
		);
		container3.add(
			this.add
				.text(
					0,
					height / 3 - height / 2,
					"Get either 3 or 4 in a row to get points",
					{
						font: `${getFontSize(24)}px Megrim`,
						fill: "#fff",
					}
				)
				.setOrigin(0.5)
				.setAlign("center")
				.setWordWrapWidth(width)
		);
		container3.add(
			this.add
				.text(width / 4, 0, "+10", {
					font: `${getFontSize(DEFAULT_FONT_SIZE)}px Megrim`,
					fill: "#fff",
				})
				.setOrigin(0.5)
				.setAlign("center")
				.setWordWrapWidth(width)
		);

		container3.add(
			this.add
				.text(width / 4, height / 6, "+5", {
					font: `${getFontSize(DEFAULT_FONT_SIZE)}px Megrim`,
					fill: "#fff",
				})
				.setOrigin(0.5)
				.setAlign("center")
				.setWordWrapWidth(width)
		);

		const cross1 = this.add.image(0, 0, "cross").setScale(0.5);
		const cross2 = this.add.image(0, 0, "cross").setScale(0.5);
		const cross3 = this.add.image(0, 0, "cross").setScale(0.5);
		const cross4 = this.add.image(0, 0, "cross").setScale(0.5);
		const crossWidth = cross1.displayWidth;
		cross1.setX(-4 * crossWidth);
		cross2.setX(-2 * crossWidth);
		cross3.setX(-1 * crossWidth);
		cross4.setX(-3 * crossWidth);

		this.tweens.add({
			targets: [cross1, cross2, cross3],
			y: { from: -height / 12, to: height / 12 },
			duration: 2000,
			ease: "linear",
			loop: -1,
		});
		const cross5 = this.add.image(0, height / 6, "cross").setScale(0.5);
		const circle6 = this.add.image(0, height / 6, "circle").setScale(0.5);
		const circle7 = this.add.image(0, height / 6, "circle").setScale(0.5);
		const circle8 = this.add.image(0, height / 6, "circle").setScale(0.5);
		cross5.setX(-4 * crossWidth);
		circle6.setX(-3 * crossWidth);
		circle7.setX(-1 * crossWidth);
		circle8.setX(-2 * crossWidth);

		this.tweens.add({
			targets: [cross5, circle6, circle7],
			y: { from: height / 6 - height / 12, to: height / 6 + height / 12 },
			duration: 2000,
			ease: "linear",
			loop: -1,
		});

		container3.add([
			cross1,
			cross2,
			cross3,
			cross4,
			cross5,
			circle6,
			circle7,
			circle8,
		]);
		parentContainer.add(container3);
		//#endregion

		const next = this.add
			.text(width, height - panel.height, "Next >", {
				font: `${getFontSize(DEFAULT_FONT_SIZE)}px Megrim`,
				fill: "#fff",
			})
			.setOrigin(1, 1);

		const back = this.add
			.text(0, height - panel.height, "< Back", {
				font: `${getFontSize(DEFAULT_FONT_SIZE)}px Megrim`,
				fill: "#fff",
			})
			.setOrigin(0, 1)
			.setActive(false)
			.setVisible(false);

		const skip = this.add
			.text(width / 2, height - panel.height / 2, "Skip", {
				font: `${getFontSize(DEFAULT_FONT_SIZE)}px Megrim`,
				fill: "#232323",
			})
			.setOrigin(0.5);

		next.setInteractive().on("pointerdown", () => {
			if (!this.canClick) return;
			this.canClick = false;
			this.tweens.add({
				targets: parentContainer,
				x: {
					from: parentContainer.x,
					to: parentContainer.x - width,
				},
				duration: 200,
				onComplete: (tween: Phaser.Tweens.Tween) => {
					this.currentIndex++;
					if (this.currentIndex > 0) {
						back.setActive(true).setVisible(true).setInteractive();
					}
					if (this.currentIndex > 1) {
						skip.setText("Play Game");
						next.setActive(false)
							.setVisible(false)
							.disableInteractive();
					}
					this.canClick = true;
					tween.remove();
				},
			});
		});

		back.on("pointerdown", () => {
			if (!this.canClick) return;
			this.canClick = false;
			this.tweens.add({
				targets: parentContainer,
				x: {
					from: parentContainer.x,
					to: parentContainer.x + width,
				},
				duration: 200,
				onComplete: (tween: Phaser.Tweens.Tween) => {
					this.currentIndex--;
					if (this.currentIndex < 2) {
						next.setActive(true).setVisible(true).setInteractive();
					}

					if (this.currentIndex < 1) {
						back.setActive(false)
							.setVisible(false)
							.disableInteractive();
					}
					this.canClick = true;
					tween.remove();
				},
			});
		});

		panel.setInteractive().on("pointerdown", () => {
			if (!this.canClick) return;
			this.cameras.main.fadeOut(500);
			this.cameras.main.once("camerafadeoutcomplete", () => {
				this.scene.start(SCENES.GAME);
				this.scene.launch(SCENES.UI);
			});
		});
	}
}
