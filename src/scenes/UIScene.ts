import { SCENES, getFontSize, DEFAULT_FONT_SIZE } from "../config";
import GameEventEmitter, { GAME_EVENTS } from "../classes/GameEvents";

export default class UIScene extends Phaser.Scene {
	//Top panel
	panel: Phaser.GameObjects.Image;

	//Score
	addText: Phaser.GameObjects.Text;
	scoreText: Phaser.GameObjects.Text;
	score: number;
	inc: number;
	//Tween Timeline
	tween: Phaser.Tweens.Tween;

	constructor() {
		super(SCENES.UI);
	}

	preload() {
		this.score = 0;
		this.inc = 0;
	}

	create() {
		const width = this.game.canvas.width;
		const height = this.game.canvas.height;

		this.panel = this.add.image(width / 2, 0, "uipanel").setOrigin(0.5, 0);
		this.scoreText = this.add
			.text(width / 2, this.panel.height / 2, "Score: 0", {
				font: `${getFontSize(DEFAULT_FONT_SIZE)}px Megrim`,
				fill: "#232323",
			})
			.setOrigin(0.5);

		this.addText = this.add
			.text(width / 2, height / 6, "+1", {
				font: `${getFontSize(48)}px Megrim`,
				fill: "#fff",
			})
			.setOrigin(0.5)
			.setAlpha(0);

		const touchToStart = this.add
			.text(width / 2, height / 2, "Touch To Start", {
				font: `${getFontSize(DEFAULT_FONT_SIZE)}px Megrim`,
				fill: "#fff",
			})
			.setOrigin(0.5);

		const tween = this.tweens.add({
			targets: touchToStart,
			alpha: { from: 1, to: 0 },
			duration: 500,
			ease: "linear",
			yoyo: true,
			loop: -1,
		});
		this.tween = this.tweens.add({
			targets: this.addText,
			duration: 500,
			y: { from: height / 6, to: this.panel.height / 2 },
			alpha: { from: 1, to: 0 },
			repeat: 0,
			ease: "cubic.in",
			onComplete: () => {
				this.addText.setActive(false).setVisible(false);

				this.score += this.inc;
				this.scoreText.setText("Score: " + this.score.toString());
			},
			paused: true,
		});
		this.input.once("pointerdown", () => {
			tween.remove();
			touchToStart.destroy();
			GameEventEmitter.getInstance().emit(GAME_EVENTS.gameStarted);
		});

		GameEventEmitter.getInstance().addListener(
			GAME_EVENTS.addScore,
			this.addScore,
			this
		);

		GameEventEmitter.getInstance().addListener(
			GAME_EVENTS.gameOver,
			() => {
				this.cameras.main.fadeOut(1000);
				this.cameras.main.once("camerafadeoutcomplete", () => {
					this.scene.get(SCENES.GAME).scene.stop();
					this.scene.start(SCENES.GAMEOVER, { score: this.score });
				});
			},
			this
		);

		this.cameras.main.fadeIn(500);
	}

	addScore(inc: number) {
		this.addText
			.setText("+" + inc)
			.setActive(true)
			.setVisible(true)
			.setAlpha(1);
		this.inc = inc;
		if (!this.tween.isPlaying()) {
			this.tween.play();
		}
		if (this.tween.isPaused()) {
			this.tween.resume();
		}
		this.tween.restart();
	}
}
