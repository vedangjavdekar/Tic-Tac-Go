import { SCENES } from "../config";

export default class BootScene extends Phaser.Scene {
	static scaleFactor: number = 1;
	constructor() {
		super(SCENES.BOOT);
	}

	init() {
		this.input.mouse.disableContextMenu();
		this.scale.lockOrientation("portrait");
		this.scale.on("resize", this.resize);
		this.resize();
	}

	create() {
		this.scene.start(SCENES.LOAD);
	}

	resize() {
		console.log("resize event");
		var canvas = this.game.canvas,
			width = window.innerWidth,
			height = window.innerHeight;
		var wratio = width / height,
			ratio = canvas.width / canvas.height;

		if (wratio < ratio) {
			canvas.style.width = width + "px";
			canvas.style.height = width / ratio + "px";
		} else {
			canvas.style.width = height * ratio + "px";
			canvas.style.height = height + "px";
		}

		BootScene.scaleFactor = 1920 / height;
	}
}
