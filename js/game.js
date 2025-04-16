import Cactus from './cactus.js';
import Bird from './bird.js';

class Game {
    constructor(ctx) {
        this.obstacles = [];
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.gameOver = false;
        this.lastSpawnTime = 0;
        this.minSpawnInterval = 1000; // Minimum time between obstacle spawns in milliseconds
        this.spawnChance = 0.5; // 50% chance to spawn a second obstacle
    }
    
    spawnObstacle(speed, score) {
        const currentTime = Date.now();
        const x = this.canvas.width;
        const y = this.canvas.height-95;

        // Spawn first obstacle
        if (score >= 200 && Math.random() < 0.5) {
            const bird = new Bird(this.ctx, x, y, speed);
            this.obstacles.push(bird);
        } else {
            const cactus = new Cactus(this.ctx, x, y, speed);
            this.obstacles.push(cactus);
        }

        // Possibly spawn a second obstacle with some distance
        if (score >= 100 && Math.random() < this.spawnChance) {
            // Add a delayed second obstacle
            const safeDistance = Math.random() * (400 - 300) + 300; // Random distance between 300-400 pixels
            
            setTimeout(() => {
                if (!this.gameOver) {  // Only spawn if game is still running
                    if (score >= 200 && Math.random() < 0.4) {
                        const bird2 = new Bird(this.ctx, x + safeDistance, y, speed);
                        this.obstacles.push(bird2);
                    } else {
                        const cactus2 = new Cactus(this.ctx, x + safeDistance, y, speed);
                        this.obstacles.push(cactus2);
                    }
                }
            }, (safeDistance / speed) * 16); // Convert distance to time based on speed
        }

        this.lastSpawnTime = currentTime;
    }
    
    updateObstacles() {
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obstacle = this.obstacles[i];
            obstacle.update();
            if (obstacle.isOffScreen()) {
                // Remove the obstacle when it goes off screen
                this.obstacles.splice(i, 1);
            }
        }
    }
    
    checkCollision(dino) {
        for (const obstacle of this.obstacles) {
            // Improved collision detection with smaller hitbox
            const hitboxPadding = 10; // Make hitbox slightly smaller than visual size
            if (
                dino.x + hitboxPadding < obstacle.x + obstacle.width - hitboxPadding &&
                dino.x + dino.width - hitboxPadding > obstacle.x + hitboxPadding &&
                dino.y + hitboxPadding < obstacle.y + obstacle.height - hitboxPadding &&
                dino.y + dino.height - hitboxPadding > obstacle.y + hitboxPadding
            ) {
                this.gameOver = true;
                return true;
            }
        }
        return false;
    }
    
    renderObstacles() {
        this.obstacles.forEach(obstacle => obstacle.render());
    }

    reset() {
        this.obstacles = [];
        this.gameOver = false;
        this.lastSpawnTime = 0;
    }

    // New method to adjust difficulty based on score
    adjustDifficulty(score) {
        // Increase spawn chance and decrease minimum spawn interval as score increases
        this.spawnChance = Math.min(0.7, 0.5 + score/1000); // Max 70% chance for double obstacles
        this.minSpawnInterval = Math.max(500, 1000 - score); // Minimum 500ms between spawns
    }
}

export default Game;
