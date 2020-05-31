import { SCENES, config, DEFAULT_FONT_SIZE, getFontSize } from "../config";
import { ASSET_PATHS } from "../assetpaths";

export default class LoadScene extends Phaser.Scene {
	static scaleFactor: number = 1;
	constructor() {
		super(SCENES.LOAD);
	}
	init() {
		this.scale.lockOrientation("portrait");
		this.scale.on("resize", this.resize);
		//this.resize();
	}
	preload() {
		const width = this.game.canvas.width;
		const height = this.game.canvas.height;

		/*** GRAPHICS ***/
		const graphics = this.add.graphics();

		this.load.svg("button", ASSET_PATHS.SVGS.BUTTON, {
			scale: LoadScene.scaleFactor,
		});
		this.load.svg("buttonwide", ASSET_PATHS.SVGS.BUTTONWIDE, {
			scale: LoadScene.scaleFactor,
		});
		this.load.svg("circle", ASSET_PATHS.SVGS.CIRCLE, {
			scale: LoadScene.scaleFactor,
		});
		this.load.svg("cross", ASSET_PATHS.SVGS.CROSS, {
			scale: LoadScene.scaleFactor,
		});

		this.load.svg("uipanel", ASSET_PATHS.SVGS.PANEL, {
			scale: LoadScene.scaleFactor,
		});

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

	resize() {
		console.log("resize canvas");
		let game_ratio = 360 / 640;

		let div = document.getElementById("phaser-app");
		div.style.width = window.innerHeight * game_ratio + "px";
		div.style.height = window.innerHeight + "px";

		let canvas = document.getElementsByTagName("canvas")[0];
		let dpi_w = parseInt(div.style.width) / canvas.width;
		let dpi_h = parseInt(div.style.height) / canvas.height;

		let height = window.innerHeight * (dpi_w / dpi_h);
		let width = height * game_ratio;

		canvas.style.width = width + "px";
		canvas.style.height = height + "px";
		LoadScene.scaleFactor = width / 360;
	}
}
