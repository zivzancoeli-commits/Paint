const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let mouseDown = false;
let mouseX = 0;
let mouseY = 0;

canvas.addEventListener("mousedown", function () {
    if (mouseY < toolbarHeight) {
        toolbarClick();
    } else if (tool === "Bucket") {
        bucketFill(Math.floor(mouseX), Math.floor(mouseY));
    } else {
        mouseDown = true;
        startX = mouseX;
        startY = mouseY;
    }
});

document.addEventListener("mouseup", function () {
    if (mouseDown && tool === "Line") drawLine(startX, startY, mouseX, mouseY);
    if (mouseDown && tool === "Circle") drawCircle(startX, startY, mouseX, mouseY);
    mouseDown = false;
});

document.addEventListener("mousemove", function (event) {
    let rect = canvas.getBoundingClientRect();
    mouseX = (event.clientX - rect.left) * (canvas.width / rect.width);
    mouseY = (event.clientY - rect.top) * (canvas.height / rect.height);
})
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);


let brushX = 1;
let brushY = 1;
let brushSize = 1;
let color = "rgb(0, 0, 0)";
let tool = "Brush";
let toolbarHeight = 80;
let colors = ["rgb(0, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 165, 0)", "rgb(255, 255, 0)", "rgb(0, 200, 0)", "rgb(0, 0, 255)", "rgb(160, 0, 200)", "rgb(255, 255, 255)", "rgb(75, 75, 75)"];
let sizes = [1, 2, 4];
let tools = ["Brush", "Line", "Circle", "Bucket"];
let startX = 0;
let startY = 0;

function drawDot(x, y) {
    let size = brushSize * 5;
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor((x - size / 2) / 5) * 5, Math.floor((y - size / 2) / 5) * 5, size, size);
}

function drawLine(x1, y1, x2, y2) {
    let distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    let steps = Math.ceil(distance / 2) + 1;
    for (let i = 0; i <= steps; i++) {
        let t = i / steps;
        drawDot(x1 + (x2 - x1) * t, y1 + (y2 - y1) * t);
    }
}

function drawCircle(cx, cy, x2, y2) {
    let radius = Math.sqrt((x2 - cx) ** 2 + (y2 - cy) ** 2);
    let steps = Math.ceil(radius * 3) + 8;
    for (let i = 0; i < steps; i++) {
        let angle = (i / steps) * Math.PI * 2;
        drawDot(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
    }
}

function bucketFill(x, y) {
    let data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    function colorAt(px, py) {
        let i = (py * canvas.width + px) * 4;
        return data[i] + "," + data[i + 1] + "," + data[i + 2];
    }
    let firstX = Math.floor(x / 5) * 5;
    let firstY = Math.floor(y / 5) * 5;
    let target = colorAt(firstX, firstY);
    let visited = {};
    let stack = [[firstX, firstY]];
    ctx.fillStyle = color;
    while (stack.length > 0) {
        let p = stack.pop();
        let px = p[0];
        let py = p[1];
        if (px < 0 || px >= canvas.width || py < toolbarHeight || py >= canvas.height) continue;
        if (visited[px + "," + py]) continue;
        visited[px + "," + py] = true;
        if (colorAt(px, py) !== target) continue;
        ctx.fillRect(px, py, 5, 5);
        stack.push([px + 5,py], [px - 5, py], [px, py + 5], [px, py - 5]);
    }
}

function drawToolBar() {
    ctx.fillStyle = "rgb(60, 60, 60)";
    ctx.fillRect(0, 0, canvas.width, toolbarHeight);

    // colors
    for (let i = 0; i < colors.length; i++) {
        ctx.fillStyle = colors[i];
        ctx.fillRect(10 + i * 35, 5, 30, 30);
        if (colors[i] === color) {
            ctx.fillStyle = "white";
            ctx.fillRect(10 + i * 35, 36, 30, 3);
        }
    }

    // brush sizes
    for (let i = 0; i < sizes.length; i++) {
        ctx.fillStyle = "rgb(90, 90, 90)";
        ctx.fillRect(320 + i * 40, 5, 30, 30);
        let s = sizes[i] * 5;
        ctx.fillStyle = "white";
        ctx.fillRect(335 + i * 40 - s / 2, 20 - s / 2, s, s);
        if (sizes[i] === brushSize) {
            ctx.fillRect(320 + i * 40, 36, 30, 3);
        }
    }

    ctx.fillStyle = "rgb(90, 90, 90)";
    ctx.fillRect(560, 5, 70, 30);
    ctx.fillStyle = "white";
    ctx.font = "18px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Clear", 595, 26);

    // tools
    for (let i = 0; i < tools.length; i++) {
        ctx.fillStyle = "rgb(90, 90, 90)";
        ctx.fillRect(10 + i * 80, 45, 70, 30);
        ctx.fillStyle = "white";
        ctx.fillText(tools[i], 45 + i * 80, 66);
        if (tools[i] === tool) {
            ctx.fillRect(10 + i * 80, 76, 70, 3)
        }
    }
}

function toolbarClick() {
    if (mouseY < 40) {
        for (let i  = 0; i < colors.length; i++) {
            if (mouseX > 10 + i * 35 && mouseX < 40 + i * 35) {
                color = colors[i];
            }
        }
        for (let i = 0; i < sizes.length; i++) {
            if (mouseX > 320 + i * 40 && mouseX < 350 + i * 40) {
                brushSize = sizes[i];
            }
        }
        if (mouseX > 560 && mouseX < 630) {
            ctx.fillStyle = "white";
            ctx.fillRect(0, toolbarHeight, canvas.width, canvas.height);
        }
    }
    if (mouseY >= 40) {
        for (let i = 0; i < tools.length; i++) {
            if (mouseX > 10 + i * 80 && mouseX < 80 + i * 80) {
                tool = tools[i];
            }
        }
    }
}


function gameLoop() {
    let size = brushSize * 5;
    brushX = mouseX;
    brushY = mouseY;
    if (mouseDown && tool === "Brush") {
    ctx.fillStyle = color;
    drawDot(brushX, brushY);
    }
    drawToolBar();
    requestAnimationFrame(gameLoop);
}
gameLoop();