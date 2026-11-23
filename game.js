const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let brushX = 0;
let brushY = 0;
brushSize = 1;

function gameLoop() {
    ctx.fillStyle = "white";
    ctx.fillRect(brushX, brushY, brushSize, brushSize)
}
setInterval(gameLoop, 1)