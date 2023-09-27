// document.addEventListener("DOMContentLoaded", () => {
var _a;
var width = 10;
// const L: PieceType = [
// 	[1, width + 1, width * 2 + 1, 2],
// 	[width, width + 1, width + 2, width * 2 + 2],
// 	[1, width + 1, width * 2 + 1, width * 2],
// 	[width, width * 2, width * 2 + 1, width * 2 + 2]
// ];
// const Z: PieceType = [
// 	[0, width, width + 1, width * 2 + 1],
// 	[width + 1, width + 2, width * 2, width * 2 + 1],
// 	[0, width, width + 1, width * 2 + 1],
// 	[width + 1, width + 2, width * 2, width * 2 + 1]
// ]
// const T: PieceType = [
// 	[1, width, width + 1, width + 2],
// 	[1, width + 1, width + 2, width * 2 + 1],
// 	[width, width + 1, width + 2, width * 2 + 1],
// 	[1, width, width + 1, width * 2 + 1]
// ]
// const O: PieceType = [
// 	[0, 1, width, width + 1],
// 	[0, 1, width, width + 1],
// 	[0, 1, width, width + 1],
// 	[0, 1, width, width + 1]
// ]
// const I: PieceType = [
// 	[1, width + 1, width * 2 + 1, width * 3 + 1],
// 	[width, width + 1, width + 2, width + 3],
// 	[1, width + 1, width * 2 + 1, width * 3 + 1],
// 	[width, width + 1, width + 2, width + 3]
// ]
var L = [
    [0, width, width * 2, 1],
    [0, 1, 2, width + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [0, width, width + 1, width + 2]
];
var Z = [
    [0, width, width + 1, width * 2 + 1],
    [1, 2, width, width + 1]
];
var T = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
];
var O = [
    [0, 1, width, width + 1]
];
var I = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width - 1, width, width + 1, width + 2]
];
var colors = [
    "red",
    "blue",
    "green",
    "yellow",
    "orange",
    "brown",
    "purple"
];
var shapes = [L, Z, O, I, T];
var score = document.querySelector("#score");
score.innerHTML = "0";
var gameOverDiv = document.querySelector("#game-over");
var grid = document.querySelector(".grid");
var nSquares = 200;
var gamePaused = true;
var gameOver = false;
var currPosition;
var currPieceType;
var possibleRotations;
var currRotation;
var currPiece;
var lastColor = "";
var currColor;
var timerId;
// Spawns game grid
for (var i = 0; i < nSquares; i++) {
    var square = document.createElement("div");
    grid.append(square);
}
var squares = Array.from(document.querySelectorAll(".grid div"));
// Generation
function getRandom(upTo) {
    return Math.floor(Math.random() * upTo);
}
function getRandomPiece() {
    currPieceType = shapes[getRandom(shapes.length)];
    possibleRotations = currPieceType.length;
    currRotation = getRandom(possibleRotations);
    return currPieceType[currRotation];
}
function getDifferentColor() {
    var color;
    if (lastColor) {
        do {
            color = colors[getRandom(colors.length)];
        } while (color == lastColor);
        lastColor = currColor;
    }
    else {
        color = colors[getRandom(colors.length)];
        lastColor = color;
    }
    return color;
}
// Game loop
function draw() {
    currPiece.forEach(function (i) { squares[currPosition + i].classList.add("shape", currColor); });
}
function undraw() {
    currPiece.forEach(function (i) { squares[currPosition + i].classList.remove("shape", currColor); });
}
function isGridFull() {
    return currPiece.some(function (i) { return squares[currPosition + i + width].classList.contains("set-shape"); });
}
function nextPiece() {
    currPosition = 4;
    currPiece = getRandomPiece();
    currColor = getDifferentColor();
    if (isGridFull())
        endGame();
    else
        draw();
}
function cleanFullLines() {
    for (var y = nSquares / width; y > 0; y--) {
        var emptySquare = false;
        for (var x = 0; x < width; x++) {
            if (squares[y + x].classList.length == 0) {
                emptySquare = true;
                continue;
            }
        }
        if (!emptySquare) {
            for (var i = 0; i < width; i++) {
                squares[y + i].classList.remove("set-shape");
            }
            score.innerHTML = String(Number(score.innerHTML) + 1);
        }
    }
}
function freeze() {
    if (currPiece.some(function (i) { return ((currPosition + i + width) % nSquares < 10)
        || (squares[currPosition + i + width].classList.contains("set-shape")); })) {
        currPiece.forEach(function (i) { squares[currPosition + i].classList.remove("shape"); });
        currPiece.forEach(function (i) { squares[currPosition + i].classList.add("set-shape"); });
        nextPiece();
    }
    cleanFullLines();
}
function moveDown() {
    freeze();
    undraw();
    currPosition += width;
    draw();
    freeze();
}
// Input
function togglePause() {
    if (gameOver)
        resetGame();
    gamePaused = !gamePaused;
    if (gamePaused) {
        grid.classList.add("paused");
        clearInterval(timerId);
    }
    else {
        timerId = setInterval(moveDown, 1000);
        grid.classList.remove("paused");
    }
    console.log("Game paused: " + gamePaused);
}
(_a = document.querySelector("#start-btn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", togglePause);
function canMoveLeft() {
    if (currPiece.some(function (i) { return squares[currPosition + i + width - 1].classList.contains("set-shape"); }))
        return false;
    return true;
}
function canMoveRight() {
    if (currPiece.some(function (i) { return squares[currPosition + i + width + 1].classList.contains("set-shape"); }))
        return false;
    return true;
}
function rotate() {
    undraw();
    currRotation == possibleRotations - 1 ? currRotation = 0 : currRotation++;
    currPiece = currPieceType[currRotation];
    draw();
}
document.addEventListener("keydown", function (event) {
    if (event.key == " ")
        togglePause();
    if (gamePaused)
        return;
    if (event.key == "ArrowLeft" || event.key == "a" || event.key == "A") {
        if (currPosition > 0 && canMoveLeft()) {
            undraw();
            currPosition--;
            draw();
            freeze();
        }
    }
    else if (event.key == "ArrowRight" || event.key == "d" || event.key == "D") {
        if (currPosition % 10 < 9 && canMoveRight()) {
            undraw();
            currPosition++;
            draw();
            freeze();
        }
    }
    else if (event.key == "ArrowDown" || event.key == "s" || event.key == "S") {
        moveDown();
    }
    else if (event.key == "r" || event.key == "R") {
        rotate();
    }
});
blur();
// Game control
function resetGame() {
    gameOver = false;
    gameOverDiv.innerHTML = "";
    squares.forEach(function (item) { item.className = ""; });
    newGame();
}
function endGame() {
    togglePause();
    gameOver = true;
    gameOverDiv.innerHTML = "GAME OVER";
}
function newGame() {
    nextPiece();
}
// Entrypoint
newGame();
