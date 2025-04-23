// index.js

// Get the canvas and set up the 2D context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Import game objects
import Dino from './js/dino.js';
import Ground from './js/ground.js';
import Game from './js/game.js';

// Initialize instances of game objects
const dino = new Dino(ctx);
const ground = new Ground(ctx);
const game = new Game(ctx);

// Set up the Game Variables
let gameStarted = false;
let score = 0;
let highScore = 0;
let lastObstacleScore = 0;
let speed = 5;
let animationFrameId = null;  // Add this to track animation frame

// Load high score from localStorage if it exists
if (localStorage.getItem('highScore')) {
    highScore = parseInt(localStorage.getItem('highScore'));
    document.getElementById('highScore').innerHTML = highScore;
}

// Event listener for game start and restart
addEventListener('keydown', function(event) {
    if (event.key === ' ' || event.key === 'ArrowUp' || event.key === 'w') {
        if (!gameStarted || game.gameOver) {
            resetGame();
        } else {
            dino.jump();  // Only jump if game is running
        }
    } else if (event.key === 'ArrowDown' || event.key === 's') {
        dino.crouch();
    }
});

function updateScore() {
    document.getElementById('score').innerHTML = Math.floor(score);
    if (Math.floor(score) > highScore) {
        highScore = Math.floor(score);
        localStorage.setItem('highScore', highScore);
        document.getElementById('highScore').innerHTML = highScore;
    }
}

function resetGame() {
    // Cancel any existing animation frame
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    // Reset all game states
    game.reset();
    score = 0;
    lastObstacleScore = 0;
    speed = 5;
    dino.reset();
    gameStarted = true;
    
    // Start the game loop again
    render();
}

function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
    
    ctx.font = '24px Arial';
    ctx.fillText('Press SPACE to restart', canvas.width / 2, canvas.height / 2 + 40);
}

function drawStartScreen() {
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Press SPACE to start', canvas.width / 2, canvas.height / 2);
}

// Game render loop
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ground.render();
    dino.render();

    if (!gameStarted) {
        drawStartScreen();
    } else {
        if (!game.gameOver) {
            if (Math.floor(score) % 20 === 0 && Math.floor(score) !== lastObstacleScore) {
                game.spawnObstacle(speed, score);
                lastObstacleScore = Math.floor(score);
            }

            game.renderObstacles();
            game.updateObstacles();

            // Check for collisions
            if (game.checkCollision(dino)) {
                game.gameOver = true;
                drawGameOver();
            } else {
                ground.update(speed);
                dino.update();
                score += 0.1;
                updateScore();
                speed += 0.0001;
            }
        } else {
            game.renderObstacles();  // Keep rendering obstacles when game is over
            ground.render();         // Keep rendering ground
            drawGameOver();
        }
    }

    // Continue animation unless game is over
    if (!game.gameOver) {
        animationFrameId = requestAnimationFrame(render);
    }
}

// Initial render to show start screen
drawStartScreen();