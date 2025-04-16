import Cactus from './cactus.js';
import Bird from './bird.js';

class Game {
    constructor(ctx) {
        this.obstacles = [];
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.gameOver = false;
    }
    
    spawnObstacle(speed, score) {
        const x = this.canvas.width;
        const y = this.canvas.height-95;

        if (score >= 200 && Math.random() < 0.5) {
            const bird = new Bird(this.ctx, x, y, speed);
            this.obstacles.push(bird);
        } else {
            const cactus = new Cactus(this.ctx, x, y, speed);
            this.obstacles.push(cactus);
        }
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
            // Simple rectangle collision detection with 10px buffer for more forgiving collisions
            if (
                dino.x + 10 < obstacle.x + obstacle.width - 10 &&
                dino.x + dino.width - 10 > obstacle.x + 10 &&
                dino.y + 10 < obstacle.y + obstacle.height - 10 &&
                dino.y + dino.height - 10 > obstacle.y + 10
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
    }
}

export default Game;
