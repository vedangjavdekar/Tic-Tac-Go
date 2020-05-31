import {
	SCENES,
	getFontSize,
	PLAYER_PARAMS,
	DEFAULT_FONT_SIZE,
} from "../config";
import Button from "../classes/Button";

export default class GameOverScene extends Phaser.Scene {
	playAgainButton: Button;

	score: number;
	highScore: number;

	constructor() {
		super(SCENES.GAMEOVER);
	}

	init(data: any) {
		console.log(data);
		this.highScore = parseInt(
			window.localStorage.getItem(PLAYER_PARAMS.HIGH_SCORE_KEY)
		);
		this.score = data.score;
		if (this.score > this.highScore) {
			window.localStorage.setItem(
				PLAYER_PARAMS.HIGH_SCORE_KEY,
				this.score.toString()
			);
			this.highScore = this.score;
		}
	}

	preload() {}

	create() {
		const width = this.game.canvas.width;
		const height = this.game.canvas.height;

		this.add
			.text(width / 2, height / 6, "Game Over", {
				font: `${getFontSize(64)}px Megrim`,
				fill: "#fff",
			})
			.setOrigin(0.5);

		//#region  SCORE DISPLAYS
		this.add
			.text(width / 2, (2 * height) / 6, "Best Score:", {
				font: `${getFontSize(DEFAULT_FONT_SIZE)}px Megrim`,
				fill: "#fff",
			})
			.setOrigin(0.5);

		this.add
			.text(width / 2, (2.5 * height) / 6, this.highScore.toString(), {
				font: `${getFontSize(32)}px Megrim`,
				fill: "#fff",
			})
			.setOrigin(0.5);

		this.add
			.text(width / 2, (3.5 * height) / 6, "Your Score:", {
				font: `${getFontSize(DEFAULT_FONT_SIZE)}px Megrim`,
				fill: "#fff",
			})
			.setOrigin(0.5);

		this.add
			.text(width / 2, (4 * height) / 6, this.score.toString(), {
				font: `${getFontSize(32)}px Megrim`,
				fill: "#fff",
			})
			.setOrigin(0.5);

		//#endregion

		this.playAgainButton = new Button(
			this,
			width / 2,
			(3.5 * height) / 4,
			"Play Again",
			48,
			true,
			true,
			() => {
				this.cameras.main.fadeOut(200);
				this.cameras.main.once("camerafadeoutcomplete", () => {
					this.scene.start(SCENES.GAME);
					this.scene.launch(SCENES.UI);
				});
			}
		);
	}

	update() {}
}
