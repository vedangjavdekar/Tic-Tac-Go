import { SCENES, DEFAULT_FONT_SIZE, getFontSize } from "../config";
import LoadScene from "./LoadScene";
import Button from "../classes/Button";

export default class MenuScene extends Phaser.Scene {
	playButton: Button;
	constructor() {
		super(SCENES.MENU);
	}
	preload() {}

	create() {
		const width = this.game.canvas.width;
		const height = this.game.canvas.height;

		this.add
			.text(width / 2, height / 6, "Tic-Tac-Go", {
				font: `${getFontSize(64)}px Megrim`,
				fill: "#fff",
			})
			.setOrigin(0.5);

		this.playButton = new Button(
			this,
			width / 2,
			(3 * height) / 4,
			"Play",
			48,
			false,
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
