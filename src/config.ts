import LoadScene from "./scenes/LoadScene";
import MenuScene from "./scenes/MenuScene";
import GameScene from "./scenes/GameScene";
import UIScene from "./scenes/UIScene";
import GameOverScene from "./scenes/GameOverScene";
import Tutorial from "./scenes/Tutorial";
import BootScene from "./scenes/BootScene";

export const config = {
	type: Phaser.AUTO,
	backgroundColor: "#161616",
	width: 1080,
	height: 1920,
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
	},
	physics: {
		default: "arcade",
		arcade: {
			debug: false,
			gravity: {
				y: 0,
			},
		},
	},
	scene: [
		BootScene,
		LoadScene,
		MenuScene,
		Tutorial,
		GameScene,
		UIScene,
		GameOverScene,
	],
};

export enum SCENES {
	BOOT = "BOOT",
	LOAD = "LOAD",
	MENU = "MENU",
	TUTORIAL = "TUTORIAL",
	GAME = "GAME",
	UI = "UI",
	GAMEOVER = "GAMEOVER",
}

export const PLAYER_PARAMS = {
	HIGH_SCORE_KEY: "ttg_highscore",
};

export const DEFAULT_FONT_SIZE = 36;
export const getFontSize = (size: number): number => {
	return Math.round(size * BootScene.scaleFactor);
};

export type eventCallback = (...args: any[]) => void;
