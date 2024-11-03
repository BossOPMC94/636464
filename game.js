const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load images
const playerImg = new Image();
playerImg.src = 'assets/sprites/player.png'; // Minecraft character

const blockImg = new Image();
blockImg.src = 'assets/sprites/block.png'; // Minecraft block obstacle

const diamondImg = new Image();
diamondImg.src = 'assets/sprites/diamond.png'; // Diamond collectible

let player = {
    x: 100,
    y: 300,
    width: 50,
    height: 50,
    speedY: 0,
    isJumping: false
};

let obstacles = [];
let diamonds = [];
let score = 0;
let gameSpeed = 5;

// Key controls
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && !player.isJumping) jump();
});

// Jump function
function jump() {
    player.isJumping = true;
    player.speedY = -15;
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player using Minecraft character
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

    // Handle jump
    player.y += player.speedY;
    player.speedY += 0.5;  // Gravity
    if (player.y >= 300) {  // Ground level
        player.y = 300;
        player.isJumping = false;
    }

    // Generate and draw obstacles
    generateObstacles();
    drawObstacles();

    // Generate and draw diamonds
    generateDiamonds();
    drawDiamonds();

    // Detect collision with obstacles
    checkCollisions();

    // Update score and game speed
    score += 1;
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 10, 20);

    // Request the next frame
    requestAnimationFrame(gameLoop);
}

function generateObstacles() {
    if (Math.random() < 0.01) {
        obstacles.push({
            x: canvas.width,
            y: 350,
            width: 50,
            height: 50
        });
    }
}

function drawObstacles() {
    obstacles.forEach((obstacle, index) => {
        obstacle.x -= gameSpeed;
        ctx.drawImage(blockImg, obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        // Remove off-screen obstacles
        if (obstacle.x + obstacle.width < 0) obstacles.splice(index, 1);
    });
}

function generateDiamonds() {
    if (Math.random() < 0.005) {
        diamonds.push({
            x: canvas.width,
            y: 280,
            width: 30,
            height: 30
        });
    }
}

function drawDiamonds() {
    diamonds.forEach((diamond, index) => {
        diamond.x -= gameSpeed;
        ctx.drawImage(diamondImg, diamond.x, diamond.y, diamond.width, diamond.height);

        // Check if player collects diamond
        if (
            player.x < diamond.x + diamond.width &&
            player.x + player.width > diamond.x &&
            player.y < diamond.y + diamond.height &&
            player.y + player.height > diamond.y
        ) {
            diamonds.splice(index, 1);
            score += 100;
        }
    });
}

function checkCollisions() {
    obstacles.forEach((obstacle) => {
        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            alert('Game Over! Score: ' + score);
            document.location.reload();
        }
    });
}

gameLoop();
