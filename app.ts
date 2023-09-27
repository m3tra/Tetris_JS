// document.addEventListener("DOMContentLoaded", () => {

// })

type Piece = number[];
type PieceType = Piece[];

const width: number = 10;

const L: PieceType = [
	[0, width, width * 2, 1],
	[0, 1, 2, width + 2],
	[1, width + 1, width * 2 + 1, width * 2],
	[0, width, width + 1, width + 2]
];
const Z: PieceType = [
	[0, width, width + 1, width * 2 + 1],
	[1, 2, width , width + 1]
]
const T: PieceType = [
	[1, width, width + 1, width + 2],
	[1, width + 1, width + 2, width * 2 + 1],
	[width, width + 1, width + 2, width * 2 + 1],
	[1, width, width + 1, width * 2 + 1]
]
const O: PieceType = [
	[0, 1, width, width + 1]
]
const I: PieceType = [
	[1, width + 1, width * 2 + 1, width * 3 + 1],
	[width - 1, width, width + 1, width + 2]
]

const colors: string[] = [
	"red",
	"blue",
	"green",
	"yellow",
	"orange",
	"brown",
	"purple"
]

const shapes: PieceType[] = [L, Z, O, I, T];

const score = document.querySelector("#score") as HTMLElement;
score.innerHTML = "0";

const gameOverDiv = document.querySelector("#game-over") as HTMLDivElement;

const grid = document.querySelector(".grid") as HTMLDivElement;
const nSquares = 200;

let gamePaused = true;
let gameOver = false;

let currPosition: number;
let currPieceType: PieceType;
let possibleRotations: number;
let currRotation: number;
let currPiece: Piece;

let lastColor: string;
let currColor = "";

let timerId: number;

// Spawns game grid
for (let i = 0; i < nSquares; i++) {
	let square = document.createElement("div");
	grid.append(square);
}

const squares = Array.from(document.querySelectorAll(".grid div"));



// Generation

function getRandom(upTo: number): number {
	return Math.floor(Math.random() * upTo);
}

function getRandomPiece(): Piece {
	currPieceType = shapes[getRandom(shapes.length)];
	possibleRotations = currPieceType.length;
	currRotation = getRandom(possibleRotations);
	return currPieceType[currRotation];
}

function getDifferentColor(): string {
	lastColor = currColor;

	let newColor: string;
	do {
		newColor = colors[getRandom(colors.length)];
	} while (currColor && newColor == currColor);

	return newColor;
}



// Game loop

function draw(): void {
	currPiece.forEach(i => {squares[currPosition + i].classList.add("shape", currColor)});
}

function undraw(): void {
	currPiece.forEach(i => {squares[currPosition + i].classList.remove("shape", currColor)});
}



function isGridFull(): boolean {
	return currPiece.some(i => squares[currPosition + i + width].classList.contains("set-shape"))
}

function nextPiece(): void {
	currPosition = 4;
	currPiece = getRandomPiece();
	currColor = getDifferentColor();

	isGridFull() ? endGame() : draw();
}

function cleanFullLines(): void {
	for (let y = nSquares / width; y > 0; y--) {
		let emptySquare = false;

		for (let x = 0; x < width; x++) {
			if (squares[y + x].classList.length == 0) {
				emptySquare = true;
				continue;
			}
		}
		if (!emptySquare) {
			for(let i = 0; i < width; i++) {
				squares[y + i].classList.remove("set-shape");
			}
			score.innerHTML = String(Number(score.innerHTML) + 1);
		}
	}
}

function freeze(): void {
	if (currPiece.some(i => ((currPosition + i + width) % nSquares < 10)
		|| (squares[currPosition + i + width].classList.contains("set-shape")))) {
			currPiece.forEach(i => {squares[currPosition + i].classList.remove("shape")});
			currPiece.forEach(i => {squares[currPosition + i].classList.add("set-shape")});
			nextPiece();
	}
	cleanFullLines();
}

function moveDown(): void {
	freeze();
	undraw();
	currPosition += width;
	draw();
	freeze();
}



// Input

function togglePause(): void {
	if (gameOver)
		resetGame();

	gamePaused = !gamePaused;

	if (gamePaused) {
		grid.classList.add("paused");
		clearInterval(timerId);
	} else {
		timerId = setInterval(moveDown, 1000);
		grid.classList.remove("paused");
	}
}

document.querySelector("#start-btn")?.addEventListener("click", togglePause);



function canMoveLeft(): boolean {
	if (currPiece.some(i => squares[currPosition + i + width - 1].classList.contains("set-shape")))
		return false;
	return true;
}

function canMoveRight(): boolean {
	if (currPiece.some(i => squares[currPosition + i + width + 1].classList.contains("set-shape")))
		return false;
	return true;
}



function rotate(): void {
	undraw();
	currRotation == possibleRotations - 1 ? currRotation = 0 : currRotation++;
	currPiece = currPieceType[currRotation];
	draw();
}



document.addEventListener("keydown", (event) => {
	if(event.key == " ")
		togglePause();

	if (gamePaused)
		return;

	if(event.key == "ArrowLeft" || event.key == "a" || event.key == "A") {
		if (currPosition > 0 && canMoveLeft()) {
			undraw();
			currPosition--;
			draw();
			freeze();
		}
	} else if(event.key == "ArrowRight" || event.key == "d" || event.key == "D") {
		if (currPosition % 10 < 9 && canMoveRight()) {
			undraw();
			currPosition++;
			draw();
			freeze();
		}
	} else if(event.key == "ArrowDown" || event.key == "s" || event.key == "S") {
		moveDown();
	} else if (event.key == "r" || event.key == "R") {
		rotate();
	}
});
blur();



// Game control

function resetGame(): void {
	gameOver = false;
	gameOverDiv.innerHTML = "";
	squares.forEach(item => {item.className = "";});
	newGame();
}

function endGame(): void {
	togglePause();
	gameOver = true;
	gameOverDiv.innerHTML = "GAME OVER";
}

function newGame(): void {
	nextPiece();
}



// Entrypoint
newGame();
