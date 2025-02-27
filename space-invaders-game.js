class SpaceInvadersGame extends BaseGame {
    constructor(container) {
        super(container);
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.gridSize = 30;
        this.player = {
            x: this.width / 2,
            y: this.height - 50,
            width: 50,
            height: 20,
            speed: 5
        };
        this.bullets = [];
        this.invaders = [];
        this.invaderDirection = 1;
        this.invaderMoveTimer = 0;
        this.bulletCooldown = 0;
        this.isReady = false;
        this.score = 0;
    }

    reset() {
        this.player.x = this.width / 2;
        this.bullets = [];
        this.invaders = [];
        this.score = 0;
        this.isReady = false;
        this.createInvaders();
    }

    createInvaders() {
        const rows = 5;
        const cols = Math.floor(this.width / 60);
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                this.invaders.push({
                    x: col * 60 + 30,
                    y: row * 40 + 50,
                    width: 30,
                    height: 20,
                    alive: true
                });
            }
        }
    }

    start() {
        this.reset();
        this.draw();
    }

    startGame() {
        if (this.isReady) return;
        
        this.isReady = true;
        this.gameLoop = setInterval(() => this.update(), 16);
    }

    update() {
        if (!this.isReady || this.isGameOver) return;

        // Move invaders
        this.invaderMoveTimer++;
        if (this.invaderMoveTimer > 30) {
            this.moveInvaders();
            this.invaderMoveTimer = 0;
        }

        // Update bullets
        this.updateBullets();

        // Check collision
        this.checkCollisions();

        // Check game over
        this.checkGameOver();

        this.draw();
    }

    moveInvaders() {
        let hitEdge = false;
        
        for (let invader of this.invaders) {
            if (!invader.alive) continue;
            
            invader.x += 10 * this.invaderDirection;
            
            // Check if invaders hit screen edge
            if (invader.x + invader.width > this.width || invader.x < 0) {
                hitEdge = true;
            }
        }

        // Change direction and move down if hit edge
        if (hitEdge) {
            this.invaderDirection *= -1;
            
            for (let invader of this.invaders) {
                if (!invader.alive) continue;
                invader.y += 20;
            }
        }
    }

    updateBullets() {
        // Move player bullets
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            this.bullets[i].y -= 10;
            
            // Remove bullets that are off screen
            if (this.bullets[i].y < 0) {
                this.bullets.splice(i, 1);
            }
        }

        // Cooldown for shooting
        if (this.bulletCooldown > 0) {
            this.bulletCooldown--;
        }
    }

    checkCollisions() {
        // Check bullet-invader collisions
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            for (let j = this.invaders.length - 1; j >= 0; j--) {
                const bullet = this.bullets[i];
                const invader = this.invaders[j];
                
                if (!invader.alive) continue;

                if (this.checkRectCollision(bullet, invader)) {
                    // Destroy invader and bullet
                    invader.alive = false;
                    this.bullets.splice(i, 1);
                    this.score += 10;
                    break;
                }
            }
        }
    }

    checkRectCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + (rect1.width || 5) > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               (rect1.y + (rect1.height || 10)) > rect2.y;
    }

    checkGameOver() {
        // Check if invaders reached bottom
        for (let invader of this.invaders) {
            if (invader.alive && invader.y + invader.height > this.player.y) {
                this.gameOver(`Game Over! Score: ${this.score}`);
                break;
            }
        }

        // Check if all invaders are destroyed
        if (this.invaders.every(invader => !invader.alive)) {
            this.gameOver(`You Win! Score: ${this.score}`);
        }
    }

    handleInput(button, isPressed) {
        if (!isPressed) return;

        // Add specific start button handling
        if (button === 'start') {
            if (!this.isReady) {
                this.startGame();
            }
            return;
        }

        if (!this.isReady || this.isGameOver) return;

        switch(button) {
            case 'left': 
                this.player.x = Math.max(0, this.player.x - this.player.speed * 2);
                break;
            case 'right':
                this.player.x = Math.min(this.width - this.player.width, this.player.x + this.player.speed * 2);
                break;
            case 'a':
            case 'b':
                // Shoot bullet
                if (this.bulletCooldown === 0) {
                    this.bullets.push({
                        x: this.player.x + this.player.width / 2 - 2,
                        y: this.player.y,
                        width: 5,
                        height: 10
                    });
                    this.bulletCooldown = 10;
                }
                break;
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Background
        const gradient = this.ctx.createLinearGradient(0, 0, this.width, this.height);
        gradient.addColorStop(0, 'rgba(0,0,50,0.9)');
        gradient.addColorStop(1, 'rgba(0,0,20,0.9)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw stars
        this.ctx.fillStyle = 'rgba(255,255,255,0.5)';
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            this.ctx.fillRect(x, y, 2, 2);
        }

        // Draw player
        this.ctx.fillStyle = 'rgba(0,255,0,0.8)';
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);

        // Draw invaders
        this.invaders.forEach(invader => {
            if (invader.alive) {
                this.ctx.fillStyle = 'rgba(255,0,0,0.8)';
                this.ctx.fillRect(invader.x, invader.y, invader.width, invader.height);
            }
        });

        // Draw bullets
        this.ctx.fillStyle = 'rgba(255,255,0,0.8)';
        this.bullets.forEach(bullet => {
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });

        // Draw score
        this.ctx.fillStyle = 'rgba(255,255,255,0.8)';
        this.ctx.font = '16px "Press Start 2P"';
        this.ctx.fillText(`Score: ${this.score}`, 10, 25);

        // Display "Press START" message if not ready
        if (!this.isReady && !this.isGameOver) {
            this.ctx.fillStyle = 'rgba(255,255,255,0.6)';
            this.ctx.font = '20px "Press Start 2P"';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Press START', this.width / 2, this.height / 2);
            this.ctx.textAlign = 'left';
        }
    }

    restart() {
        // Clear any existing game loop
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }

        // Reset game state
        this.reset();
        
        // Clear game over overlay
        this.gameOverlay.classList.add('hidden');
        
        // Reset game state flags
        this.isGameOver = false;
        this.isReady = false;
        
        // Redraw initial state
        this.draw();
    }
}

// Register the game with the console
window.gameConsole.registerGame('space-invaders', SpaceInvadersGame);