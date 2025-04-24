class Obstacle {
    constructor(ctx, x, y, width, height, speed, imageSrc) {
        this.ctx = ctx; // canvas context to draw on
        this.x = x; // position of obstacles
        this.y = y; // position of obstacles
        this.width = width; // size of obstacles
        this.height = height; // size of obstacles
        this.speed = speed; // obstacles speed
        this.image = new Image();
        this.image.src = imageSrc; // path to the image used.
        this.frame = 0;
    }

    update() {
        // Moves the obstacle leftward by decreasing x every frame.
        this.frame++; 
        // Keeps track of how many frames have passed using this.frame
        this.x -= this.speed; 
    }

    render() {
        // Draws the obstacle at its current position and size on the canvas.
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    
        // Resets frame counter to prevent huge numbers — purely for safety or future animation timing.
        if (this.frame > 1000) {
            this.frame = 0;
        }
    }

    isOffScreen() {
        // Checks if the obstacle has fully moved off the left edge of the screen.
        return this.x + this.width < 0;
    }
}

export default Obstacle;