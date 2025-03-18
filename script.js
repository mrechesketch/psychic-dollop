const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let level = 0;
let fillMode = false;
let currentFractal = 'koch';

function resizeCanvas() {
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.9;
    canvas.width = size;
    canvas.height = size;
    draw();
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Event Listeners
document.getElementById('fractalSelect').addEventListener('change', (e) => {
    currentFractal = e.target.value;
    draw();
});

document.getElementById('toggleFill').addEventListener('click', () => {
    fillMode = !fillMode;
    document.getElementById('toggleFill').textContent = `Toggle Fill: ${fillMode ? 'ON' : 'OFF'}`;
    draw();
});

document.getElementById('increase').addEventListener('click', () => {
    level++;
    updateLevelIndicator();
    draw();
});

document.getElementById('decrease').addEventListener('click', () => {
    if (level > 0) level--;
    updateLevelIndicator();
    draw();
});

function updateLevelIndicator() {
    document.getElementById('level-indicator').textContent = `Level: ${level}`;
}

// Main draw function
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (currentFractal === 'koch') {
        drawKoch();
    } else if (currentFractal === 'sierpinski') {
        drawSierpinski();
    }
}

// Koch Snowflake
function drawKoch() {
    const size = canvas.width * 0.6;
    const height = (Math.sqrt(3) / 2) * size;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const p1 = { x: centerX, y: centerY - height / 2 };
    const p2 = { x: centerX - size / 2, y: centerY + height / 2 };
    const p3 = { x: centerX + size / 2, y: centerY + height / 2 };

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    koch(p1, p2, level);
    koch(p2, p3, level);
    koch(p3, p1, level);

    if (fillMode) {
        ctx.fillStyle = 'rgba(0, 150, 255, 0.3)';
        ctx.fill();
    }
    ctx.strokeStyle = 'black';
    ctx.stroke();
}

function koch(pA, pB, depth) {
    if (depth === 0) {
        ctx.lineTo(pB.x, pB.y);
    } else {
        const dx = (pB.x - pA.x) / 3;
        const dy = (pB.y - pA.y) / 3;

        const p1 = { x: pA.x + dx, y: pA.y + dy };
        const p3 = { x: pA.x + 2 * dx, y: pA.y + 2 * dy };

        const angle = Math.atan2(pB.y - pA.y, pB.x - pA.x) + Math.PI / 3;
        const length = Math.sqrt(dx * dx + dy * dy);
        const p2 = {
            x: p1.x + Math.cos(angle) * length,
            y: p1.y + Math.sin(angle) * length
        };

        koch(pA, p1, depth - 1);
        koch(p1, p2, depth - 1);
        koch(p2, p3, depth - 1);
        koch(p3, pB, depth - 1);
    }
}

// Sierpiński Triangle
function drawSierpinski() {
    const size = canvas.width * 0.6;
    const height = (Math.sqrt(3) / 2) * size;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const p1 = { x: centerX, y: centerY - height / 2 };
    const p2 = { x: centerX - size / 2, y: centerY + height / 2 };
    const p3 = { x: centerX + size / 2, y: centerY + height / 2 };

    ctx.beginPath();
    sierpinski(p1, p2, p3, level);

    if (fillMode) {
        ctx.fillStyle = 'rgba(0, 150, 255, 0.3)';
        ctx.fill();
    }
    ctx.strokeStyle = 'black';
    ctx.stroke();
}

function sierpinski(p1, p2, p3, depth) {
    if (depth === 0) {
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p1.x, p1.y);
    } else {
        const mid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
        const m1 = mid(p1, p2);
        const m2 = mid(p2, p3);
        const m3 = mid(p3, p1);

        sierpinski(p1, m1, m3, depth - 1);
        sierpinski(m1, p2, m2, depth - 1);
        sierpinski(m3, m2, p3, depth - 1);
    }
}
