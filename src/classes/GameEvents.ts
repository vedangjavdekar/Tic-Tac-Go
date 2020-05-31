export enum GAME_EVENTS {
	gameStarted = "gameStarted",
	addScore = "addScore",
	gameOver = "gameOver",
}

export default class GameEventEmitter extends Phaser.Events.EventEmitter {
	private static instance: GameEventEmitter;

	private constructor() {
		super();
	}

	public static getInstance(): GameEventEmitter {
		if (!GameEventEmitter.instance) {
			GameEventEmitter.instance = new GameEventEmitter();
		}
		return GameEventEmitter.instance;
	}

	clearEvents() {
		for (let key in GAME_EVENTS) {
			console.log("clearing event :" + key);
			this.removeAllListeners(key);
		}
	}
}
