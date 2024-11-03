// js/dino.js
export default class Dino {
    constructor(ctx) {
        this.ctx = ctx;
        this.sprite1 = new Image();
        this.sprite1.src = 'assets/dinorun1.png';
        this.sprite2 = new Image();
        this.sprite2.src = 'assets/dinorun2.png';
        this.x = 50;
        this.y = 355; // Ground level
        this.width = 50;
        this.height = 50;
        this.isJumping = false;
        this.jumpVelocity = 0;
        this.gravity = 1; // Gravity to pull the dino back down
        this.frame = 0;

        // Event listener for jump
        window.addEventListener('keydown', (event) => this.onKeyDown(event));
    }

    jump() {
        if (!this.isJumping) {
            this.isJumping = true;
            this.jumpVelocity = -15; // Adjust this for jump height
        }
    }

    onKeyDown(event) {
        if (event.key === ' ') {
            this.jump();
        }
    }

    update() {
        this.frame++;

        // Handle jump mechanics
        if (this.isJumping) {
            this.y += this.jumpVelocity;
            this.jumpVelocity += this.gravity; // Gravity brings the dino back down

            // Stop the jump when the dino lands
            if (this.y >= 355) { // Ground level
                this.y = 355;
                this.isJumping = false;
                this.jumpVelocity = 0;
            }
        }
    }

    render() {
        // Switch between sprite1 and sprite2 for running animation
        const sprite = this.frame % 20 < 10 ? this.sprite1 : this.sprite2;
        this.ctx.drawImage(sprite, this.x, this.y, this.width, this.height);

        // Reset frame count to prevent overflow
        if (this.frame > 1000) {
            this.frame = 0;
        }
    }
}
