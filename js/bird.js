import Obstacle from './obstacle.js';

class Bird extends Obstacle {
    constructor(ctx, x, y, speed) {
        const bird = {
            src: "assets/bird1.png",
            width: 50,
            height: 50
        }
        const y_displaced = y - bird.height - 30;
        super(ctx, x, y_displaced, bird.width, bird.height, speed, bird.src);
        this.sprite1 = new Image();
        this.sprite1.src = bird.src;
        this.sprite2 = new Image();
        this.sprite2.src = "assets/bird2.png";
    }

    // Override the render method to switch between sprite1 and sprite2
    render() {
        // Switch between sprite1 and sprite2 for running animation
        const sprite = this.frame % 20 < 10 ? this.sprite1 : this.sprite2;
        this.ctx.drawImage(sprite, this.x, this.y, this.width, this.height);
    }
}

export default Bird;