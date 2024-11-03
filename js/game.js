import Cactus from './cactus.js';

class Game {
    constructor(ctx) {
        this.obstacles = [];
        this.ctx = ctx;
        this.canvas = ctx.canvas;
    }
    
    spawnObstacle(speed) {
        const x = this.canvas.width;
        const y = this.canvas.height-95;
        const cactus = new Cactus(this.ctx, x, y, speed);
        this.obstacles.push(cactus);
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
