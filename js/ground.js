// js/ground.js
export default class Ground {
    constructor(ctx) {
        this.ctx = ctx;
        this.image = new Image();
        this.image.src = 'assets/ground.png';
        this.x = 0;
        this.y = 300;
        this.width = 800;
        this.speed = 5;
    }

    update(speed) {
        this.speed = speed;

        // Move the ground to the left for scrolling effect
        this.x -= this.speed;

        // Reset position when the ground goes off screen
        if (this.x <= -this.width) {
            this.x = 0;
        }
    }

    render() {
        // Draw the ground image twice to create a continuous scrolling effect
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.image.height);
        this.ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.image.height);
    }
}
