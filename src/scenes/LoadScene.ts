import { SCENES, config, DEFAULT_FONT_SIZE, getFontSize } from "../config";
import { ASSET_PATHS } from "../assetpaths";
import BootScene from "./BootScene";

export default class LoadScene extends Phaser.Scene {
	constructor() {
		super(SCENES.LOAD);
	}

	preload() {
		const width = this.game.canvas.width;
		const height = this.game.canvas.height;

		/*** GRAPHICS ***/
		const graphics = this.add.graphics();

		this.load.svg("button", ASSET_PATHS.SVGS.BUTTON, {
			scale: BootScene.scaleFactor,
		});
		this.load.svg("buttonwide", ASSET_PATHS.SVGS.BUTTONWIDE, {
			scale: BootScene.scaleFactor,
		});
		this.load.svg("circle", ASSET_PATHS.SVGS.CIRCLE, {
			scale: BootScene.scaleFactor,
		});
		this.load.svg("cross", ASSET_PATHS.SVGS.CROSS, {
			scale: BootScene.scaleFactor,
		});
		this.load.svg("hand", ASSET_PATHS.SVGS.HAND, {
			scale: BootScene.scaleFactor,
		});
		this.load.svg("handtouched", ASSET_PATHS.SVGS.HANDTOUCHED, {
			scale: BootScene.scaleFactor,
		});

		this.load.svg("uipanel", ASSET_PATHS.SVGS.PANEL, {
			scale: BootScene.scaleFactor,
		});

		//Sounds
		this.load.audio("music", [ASSET_PATHS.SOUNDS.MUSIC]);
		this.load.audio("normal", [
			ASSET_PATHS.SOUNDS.NORMAL_MP3,
			ASSET_PATHS.SOUNDS.NORMAL_OGG,
		]);
		this.load.audio("bonus", [
			ASSET_PATHS.SOUNDS.BONUS_MP3,
			ASSET_PATHS.SOUNDS.BONUS_OGG,
		]);

		const progressText = this.add
			.text(
				width / 2,
				height / 2 - getFontSize(DEFAULT_FONT_SIZE),
				"0%",
				{
					font: `${getFontSize(DEFAULT_FONT_SIZE)}px Megrim`,
					fill: "#ffffff",
				}
			)
			.setOrigin(0.5);

		this.load.on("progress", (value: number) => {
			graphics.clear();
			graphics.fillStyle(0xfffffff, 1);
			graphics.fillRect(
				width / 4,
				height / 2 - height / 80,
				(value * width) / 2,
				height / 40
			);
			progressText.setText(Math.round(value * 100) + "%");
		});
	}

	create() {
		this.cameras.main.fadeOut(200);
		this.cameras.main.once("camerafadeoutcomplete", () => {
			this.scene.start(SCENES.MENU);
		});
	}

	update() {}
}
