import Cactus from './cactus.js';
import Bird from './bird.js';

class Game {
    constructor(ctx) {
        this.obstacles = [];
        this.ctx = ctx;
        this.canvas = ctx.canvas;
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
    
    renderObstacles() {
        this.obstacles.forEach(obstacle => obstacle.render());
    }
}

export default Game;
