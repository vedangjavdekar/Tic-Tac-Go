import { SCENES, PLAYER_PARAMS } from "../config";
import GameEventEmitter, { GAME_EVENTS } from "../classes/GameEvents";
import WallItem from "../classes/WallItem";
import Player from "../classes/Player";
import Hole from "../classes/Hole";

const DEFAULT_REDUCE_ITR = 5;

const DEFAULT_GRID_SIZE = 70;
const DEFAULT_GRID_MARGIN = 10;

export type Point = { x: number; y: number };
export default class GameScene extends Phaser.Scene {
	//event emitter singleton instance
	eventEmitter: GameEventEmitter;

	//Game manager Params
	canStartGame: boolean;

	//Player
	player: Player;

	//Physics groups
	wallObjects: Phaser.Physics.Arcade.Group;
	holeObjects: Phaser.Physics.Arcade.Group;

	//Timers
	spawnTimer: Phaser.Time.TimerEvent;
	delayReducerCounter: number;

	//To store wave data
	wavesQueue: Array<Array<number>>;

	//Grid Params
	gridSlots: number;
	gridMargin: number;
	gridSize: number;
	constructor() {
		super(SCENES.GAME);
	}
	init() {
		if (
			window.localStorage.getItem(PLAYER_PARAMS.HIGH_SCORE_KEY) === null
		) {
			window.localStorage.setItem(PLAYER_PARAMS.HIGH_SCORE_KEY, "0");
		}
	}

	preload() {
		this.eventEmitter = GameEventEmitter.getInstance();
		this.canStartGame = false;
		this.wavesQueue = [];
		this.delayReducerCounter = 0;
	}

	create() {
		this.eventEmitter.clearEvents();
		const width = this.game.canvas.width;
		const height = this.game.canvas.height;

		//Grid Setup
		this.gridSize = DEFAULT_GRID_SIZE;
		this.gridMargin = DEFAULT_GRID_MARGIN;
		this.gridSlots = width / (this.gridSize + 2 * this.gridMargin);

		//#region Physics Group settings
		this.wallObjects = this.physics.add.group({
			classType: WallItem,
			defaultKey: "wall",
			maxSize: 30,
			createCallback: function (wall: WallItem) {
				wall.setName("wall " + this.getLength());
				console.log("wall " + this.getLength() + "created");
			},
		});

		this.holeObjects = this.physics.add.group({
			classType: Hole,
			defaultKey: "hole",
			maxSize: 5,
			createCallback: function (hole: Hole) {
				hole.setName("hole " + this.getLength());
				console.log("hole " + this.getLength() + "created");
			},
		});
		//#endregion

		//Player
		this.player = new Player(this, width / 2, (3 * height) / 4);
		this.player.x = this.getClosestGridPoint(this.player.x);
		this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
			if (!this.canStartGame) return;
			const x = this.getClosestGridPoint(pointer.worldX);
			this.player.move(x);
		});

		//Wave Spawn Timer
		this.spawnTimer = this.time.addEvent({
			delay: 3000,
			loop: true,
			callback: this.spawnWall,
			callbackScope: this,
			paused: true,
		});

		//Player Collisions
		this.physics.add.overlap(
			this.player,
			this.holeObjects,
			(player: Player, hole: Hole) => {
				this.checkScore();
				(hole.body as Phaser.Physics.Arcade.Body).setEnable(false);
				this.holeObjects.killAndHide(hole);
			}
		);

		this.physics.add.overlap(
			this.player,
			this.wallObjects,
			(player: Player, wall: WallItem) => {
				this.physics.world.pause();
				this.spawnTimer.paused = true;
				this.canStartGame = false;
				this.eventEmitter.emit(GAME_EVENTS.gameOver);
			}
		);

		//Game Start Event
		this.eventEmitter.addListener(GAME_EVENTS.gameStarted, () => {
			this.canStartGame = true;
			this.spawnTimer.paused = false;
		});
	}

	update() {
		if (!this.canStartGame) return;

		this.wallObjects.children.iterate((wall: WallItem) => {
			if (wall.y > this.game.canvas.height + wall.height / 2) {
				this.wallObjects.killAndHide(wall);
			}
		});
		this.holeObjects.children.iterate((hole: Hole) => {
			if (hole.y > this.game.canvas.height + hole.height / 2) {
				this.holeObjects.killAndHide(hole);
			}
		});
	}

	//#region Score Utils
	checkScore() {
		let wave = this.wavesQueue.shift();
		const index = wave.indexOf(-1);
		wave[index] = this.player.isCross ? 1 : 0;
		let scoreToAdd = 0;
		let curr = 0;
		for (let i = 0; i < wave.length - 2; i++) {
			curr = wave[i];
			let addScore = true;
			for (let j = i; j <= i + 2; j++) {
				if (wave[j] !== curr) {
					addScore = false;
					break;
				}
			}
			if (addScore) {
				scoreToAdd += 5;
			}
		}
		if (scoreToAdd > 0) {
			this.eventEmitter.emit(GAME_EVENTS.addScore, scoreToAdd);
		}
	}
	//#endregion

	//#region Hole Methods
	activateHole(hole: Hole) {
		hole.setActive(true).setVisible(true);
		(hole.body as Phaser.Physics.Arcade.Body).setEnable(true);
	}

	addHole(slot: number, y?: number): Hole {
		slot = Phaser.Math.Clamp(slot, 0, this.gridSlots);
		const spawnPoint = this.getGridPoint(slot, y);

		const hole = this.holeObjects.get(spawnPoint.x, spawnPoint.y);
		if (!hole) return null;
		this.activateHole(hole);
		return hole;
	}
	//#endregion

	//#region Wall items methods
	activateWall(wall: WallItem) {
		wall.setActive(true).setVisible(true);
	}

	addWall(slot: number, y?: number): WallItem {
		slot = Phaser.Math.Clamp(slot, 0, this.gridSlots);
		const spawnPoint = this.getGridPoint(slot, y);

		const wall = this.wallObjects.get(spawnPoint.x, spawnPoint.y);
		if (!wall) return null;
		this.activateWall(wall);
		return wall;
	}

	spawnWall() {
		const hole = Phaser.Math.Between(0, 3);
		const h = this.textures.getFrame("circle", 0).height;
		let wave = [];
		for (let i = 0; i < this.gridSlots; i++) {
			if (i === hole) {
				const holeObj = this.addHole(i, (-3 * h) / 8);
				if (holeObj) {
					(holeObj.body as Phaser.Physics.Arcade.Body).setVelocityY(
						200
					);
				}
				wave.push(-1);
				continue;
			}
			const wall = this.addWall(i, 0);
			if (wall) {
				const isCross = Phaser.Math.Between(0, 100) % 2;
				wall.changeSymbol(isCross == 1);
				(wall.body as Phaser.Physics.Arcade.Body).setVelocityY(200);
				wave.push(isCross);
			}
		}
		this.wavesQueue.push(wave);
		this.delayReducerCounter++;
		if (this.delayReducerCounter % DEFAULT_REDUCE_ITR === 0) {
			this.delayReducerCounter = 0;
			const newDelay = Phaser.Math.Clamp(
				this.spawnTimer.delay - 200,
				1000,
				3000
			);
			this.spawnTimer.reset({
				delay: newDelay,
				loop: true,
				callback: this.spawnWall,
				callbackScope: this,
			});
			console.log("new delay:" + newDelay);
		}
	}

	//#endregion

	//#region Grid utils
	getGridPoint(slot: number, y?: number): Point {
		let setY = y || 0;
		let setX =
			slot * (this.gridSize + 2 * this.gridMargin) + 0.5 * this.gridSize;
		return { x: setX, y: setY };
	}
	getClosestGridPoint(x: number): number {
		let slot = Math.round(
			(x - 0.5 * this.gridSize) / (this.gridSize + 2 * this.gridMargin)
		);
		slot = Phaser.Math.Clamp(slot, 0, this.gridSlots - 1);
		return (
			slot * (this.gridSize + 2 * this.gridMargin) + 0.5 * this.gridSize
		);
	}
	//#endregion
}
