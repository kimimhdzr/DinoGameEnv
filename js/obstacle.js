class Obstacle {
    constructor(ctx, x, y, width, height, speed, imageSrc) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.image = new Image();
        this.image.src = imageSrc;
    }

    update() {
        this.x -= this.speed;
    }

    render() {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }
}

export default Obstacle;