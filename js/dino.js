// js/dino.js
export default class Dino {
    constructor(ctx) {
        this.ctx = ctx;
        this.sprite1 = new Image();
        this.sprite1.src = 'assets/dinorun1.png';
        this.sprite2 = new Image();
        this.sprite2.src = 'assets/dinorun2.png';
        this.groundLevel = 355;
        this.x = 50;
        this.y = this.groundLevel; // Ground level
        this.width = 50;
        this.height = 50;
        this.isJumping = false;
        this.isCrouching = false;
        this.jumpVelocity = 0;
        this.crouchVelocity = 0;
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

    crouch() {
        if (!this.isCrouching) {
            this.isCrouching = true;
            this.crouchVelocity = 30; // Adjust this for crouch speed
        }
    }

    onKeyDown(event) {
        if (event.key === ' ' || event.key === 'ArrowUp' || event.key === 'w') {
            this.jump();
        } else if (event.key === 'ArrowDown' || event.key === 's') {
            this.crouch();
        }
    }

    update() {
        this.frame++;

        // Handle jump mechanics
        if (this.isJumping) {
            this.y += this.jumpVelocity;
            this.jumpVelocity += this.gravity; // Gravity brings the dino back down
            
            // Stop the jump when the dino lands
            if (this.y >= this.groundLevel) { // Ground level
                this.y = this.groundLevel;
                this.isJumping = false;
                this.jumpVelocity = 0;
            }
        }
        if (this.isCrouching) {
            this.y += this.crouchVelocity;

            if (this.y >= this.groundLevel) {
                this.y = this.groundLevel;
                this.isCrouching = false;
                this.crouchVelocity = 0;
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

    reset() {
        this.y = this.groundLevel;
        this.isJumping = false;
        this.isCrouching = false;
        this.jumpVelocity = 0;
        this.crouchVelocity = 0;
        this.frame = 0;
    }
}
