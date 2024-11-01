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

// Main render loop
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas

    ground.render();  // Render the ground
    dino.update();    // Update the dino
    dino.render();    // Render the dino

    requestAnimationFrame(render);  // Keep the loop running
}

render();  // Start the render loop
