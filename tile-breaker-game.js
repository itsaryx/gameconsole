class TileBreakerGame extends BaseGame {
    constructor(container) {
        super(container);
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.gridSize = 30;
        this.cols = Math.floor(this.width / this.gridSize);
        this.rows = Math.floor(this.height / 2 / this.gridSize);

        this.reset();
    }

    reset() {
        this.grid = [];
        this.createGrid();

        this.paddleWidth = 100;
        this.paddleHeight = 15;
        this.paddleX = (this.width - this.paddleWidth) / 2;

        this.ballRadius = 10;
        this.ballX = this.width / 2;
        this.ballY = this.height - 50;

        this.ballSpeedX = 0;
        this.ballSpeedY = 0;

        this.score = 0;
        this.lives = 3;
        this.isReady = false;
    }

    createGrid() {
        for (let r = 0; r < this.rows; r++) {
            this.grid[r] = [];
            for (let c = 0; c < this.cols; c++) {
                this.grid[r][c] = Math.random() > 0.3 ? 1 : 0;
            }
        }
    }

    startGame() {
        if (this.isReady) return;
        
        this.isReady = true;
        this.ballSpeedX = 3;
        this.ballSpeedY = -3;
        this.gameLoop = setInterval(() => this.update(), 16);
    }

    update() {
        if (!this.isReady || this.isGameOver) return;

        this.moveBall();
        this.checkCollisions();
        this.draw();
    }

    moveBall() {
        this.ballX += this.ballSpeedX;
        this.ballY += this.ballSpeedY;

        if (this.ballX + this.ballSpeedX > this.width - this.ballRadius || 
            this.ballX + this.ballSpeedX < this.ballRadius) {
            this.ballSpeedX = -this.ballSpeedX;
        }

        if (this.ballY + this.ballSpeedY < this.ballRadius) {
            this.ballSpeedY = -this.ballSpeedY;
        }

        if (this.ballY + this.ballSpeedY > this.height - this.ballRadius) {
            this.lives--;
            if (this.lives <= 0) {
                this.gameOver(`Game Over! Score: ${this.score}`);
                return;
            }
            this.resetBall();
        }

        if (this.ballY + this.ballRadius > this.height - this.paddleHeight &&
            this.ballX > this.paddleX && 
            this.ballX < this.paddleX + this.paddleWidth) {
            let deltaX = this.ballX - (this.paddleX + this.paddleWidth / 2);
            this.ballSpeedY = -Math.abs(this.ballSpeedY);
            this.ballSpeedX = deltaX * 0.2;
        }
    }

    checkCollisions() {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.grid[r][c] === 1) {
                    const tileX = c * this.gridSize;
                    const tileY = r * this.gridSize;

                    if (this.ballX > tileX && 
                        this.ballX < tileX + this.gridSize && 
                        this.ballY > tileY && 
                        this.ballY < tileY + this.gridSize) {
                        this.ballSpeedY = -this.ballSpeedY;
                        this.grid[r][c] = 0;
                        this.score += 10;
                    }
                }
            }
        }

        if (this.isGameWon()) {
            this.gameOver(`You Win! Score: ${this.score}`);
        }
    }

    isGameWon() {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.grid[r][c] === 1) {
                    return false;
                }
            }
        }
        return true;
    }

    resetBall() {
        this.ballX = this.width / 2;
        this.ballY = this.height - 50;
        this.ballSpeedX = 3;
        this.ballSpeedY = -3;
        this.paddleX = (this.width - this.paddleWidth) / 2;
    }

    handleInput(button, isPressed) {
        if (!isPressed) return;

        if (button === 'start') {
            if (!this.isReady) {
                this.startGame();
            }
            return;
        }

        if (!this.isReady || this.isGameOver) return;

        const paddleSpeed = 20;
        switch(button) {
            case 'left': 
                this.paddleX = Math.max(0, this.paddleX - paddleSpeed);
                break;
            case 'right':
                this.paddleX = Math.min(this.width - this.paddleWidth, this.paddleX + paddleSpeed);
                break;
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        const gradient = this.ctx.createLinearGradient(0, 0, this.width, this.height);
        gradient.addColorStop(0, 'rgba(20,40,80,0.9)');
        gradient.addColorStop(1, 'rgba(10,20,40,0.9)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.grid[r][c] === 1) {
                    this.ctx.fillStyle = `hsl(${r * 20}, 70%, 50%)`;
                    this.ctx.fillRect(
                        c * this.gridSize, 
                        r * this.gridSize, 
                        this.gridSize - 1, 
                        this.gridSize - 1
                    );
                }
            }
        }

        this.ctx.fillStyle = 'rgba(0,255,0,0.8)';
        this.ctx.fillRect(this.paddleX, this.height - this.paddleHeight, this.paddleWidth, this.paddleHeight);

        this.ctx.beginPath();
        this.ctx.arc(this.ballX, this.ballY, this.ballRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = 'white';
        this.ctx.fill();
        this.ctx.closePath();

        this.ctx.fillStyle = 'rgba(255,255,255,0.8)';
        this.ctx.font = '16px "Press Start 2P"';
        this.ctx.fillText(`Score: ${this.score}`, 10, 25);
        this.ctx.fillText(`Lives: ${this.lives}`, this.width - 120, 25);

        if (!this.isReady && !this.isGameOver) {
            this.ctx.fillStyle = 'rgba(255,255,255,0.6)';
            this.ctx.font = '20px "Press Start 2P"';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Press START', this.width / 2, this.height / 2);
            this.ctx.textAlign = 'left';
        }
    }

    restart() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }

        this.reset();
        this.gameOverlay.classList.add('hidden');
        this.isGameOver = false;
        this.isReady = false;
        this.draw();
    }
}

window.gameConsole.registerGame('tile-breaker', TileBreakerGame);