// index.js

// Get the canvas and set up the 2D context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Import game objects (ensure they export a render function)
import Dino from './js/dino.js';
import Ground from './js/ground.js';

// Initialize instances of game objects
const dino = new Dino(ctx);
const ground = new Ground(ctx);

// Set up the Game Variable
let gameStarted = false;
let gameOver = false;
let score = 0;
let speed = 5;

addEventListener('keydown', function handler(event) {
    if(event.key === ' ') {
        gameStarted = true;
        removeEventListener('keydown', handler); // Remove the event listener
        // so this listener is once only before the game start
    }
});

function updateScore() {
    document.getElementById('score').innerHTML = Math.floor(score);
}

// Game Start render loop
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas

    ground.render();  // Render the ground
    dino.render();    // Render the dino

    if (gameStarted && !gameOver) {
        ground.update(speed);  // Update the ground
        dino.update();    // Update the dino
        score += 0.1;     // Increment the score more slowly
        updateScore();    // Update the score
        speed += 0.001;  // Increment the speed slowly
    }

    if (!gameOver) {
        requestAnimationFrame(render);  // Keep the loop running
    }
}

render();  // Start the game