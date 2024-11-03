import Obstacle from './obstacle.js';

class Cactus extends Obstacle {
    constructor(ctx, x, y, speed) {
        const cactusTypes = [
            { src: 'assets/cactussmallsingle.png', width: 30, height: 50 },
            { src: 'assets/cactuslargesingle.png', width: 40, height: 70 },
            { src: 'assets/cactussmalldouble.png', width: 60, height: 50 }
        ];
        const cactus = cactusTypes[Math.floor(Math.random() * cactusTypes.length)];
        const y_displaced = y - cactus.height;
        super(ctx, x, y_displaced, cactus.width, cactus.height, speed, cactus.src);
    }
}

export default Cactus;