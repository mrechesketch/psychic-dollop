const canvas = document.getElementById('fractalCanvas');
const ctx = canvas.getContext('2d');
const levelDisplay = document.getElementById('level');
let level = 0;

// Set canvas size based on window size
function resizeCanvas() {
    const side = Math.min(window.innerWidth * 0.9, 600); // cap at 600px
    canvas.width = side;
    canvas.height = side;
    draw();
}

// Draw Koch Snowflake centered in the canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const size = canvas.width * 0.75;
    const height = size * Math.sqrt(3) / 2;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const p1 = { x: centerX - size / 2, y: centerY + height / 3 };
    const p2 = { x: centerX + size / 2, y: centerY + height / 3 };
    const p3 = { x: centerX, y: centerY - (2 * height) / 3 };

    ctx.beginPath();
    koch(p1, p2, level);
    koch(p2, p3, level);
    koch(p3, p1, level);
    ctx.stroke();
}

function koch(pA, pB, depth) {
    if (depth === 0) {
        ctx.moveTo(pA.x, pA.y);
        ctx.lineTo(pB.x, pB.y);
    } else {
        const dx = (pB.x - pA.x) / 3;
        const dy = (pB.y - pA.y) / 3;

        const p1 = { x: pA.x + dx, y: pA.y + dy };
        const p3 = { x: pA.x + 2 * dx, y: pA.y + 2 * dy };

        const angle = Math.PI / 3;
        const px = p1.x + Math.cos(angle) * (p3.x - p1.x) / 2 - Math.sin(angle) * (p3.y - p1.y) / 2;
        const py = p1.y + Math.sin(angle) * (p3.x - p1.x) / 2 + Math.cos(angle) * (p3.y - p1.y) / 2;
        const p2 = { x: px, y: py };

        koch(pA, p1, depth - 1);
        koch(p1, p2, depth - 1);
        koch(p2, p3, depth - 1);
        koch(p3, pB, depth - 1);
    }
}

// Handle level controls
document.getElementById('increase').addEventListener('click', () => {
    if (level < 6) {
        level++;
        levelDisplay.textContent = `Level: ${level}`;
        draw();
    }
});

document.getElementById('decrease').addEventListener('click', () => {
    if (level > 0) {
        level--;
        levelDisplay.textContent = `Level: ${level}`;
        draw();
    }
});

// Redraw on window resize
window.addEventListener('resize', resizeCanvas);

// Initial setup
resizeCanvas();
