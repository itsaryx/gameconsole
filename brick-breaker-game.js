class BrickBreakerGame extends BaseGame {
    constructor(container) {
        super(container);
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        this.canvas.width = this.width;
        this.canvas.height = this.height;

         
        this.levelConfigs = [
            {
                brickRowCount: 3,
                brickColumnCount: 6,
                brickWidth: 60,
                brickHeight: 20,
                ballSpeedMultiplier: 1,
                paddleWidthReduction: 0
            },
            {
                brickRowCount: 4,
                brickColumnCount: 7,
                brickWidth: 55,
                brickHeight: 18,
                ballSpeedMultiplier: 1.2,
                paddleWidthReduction: 20
            },
            {
                brickRowCount: 5,
                brickColumnCount: 8,
                brickWidth: 50,
                brickHeight: 15,
                ballSpeedMultiplier: 1.5,
                paddleWidthReduction: 40
            },
            {
                brickRowCount: 6,
                brickColumnCount: 9,
                brickWidth: 45,
                brickHeight: 12,
                ballSpeedMultiplier: 1.8,
                paddleWidthReduction: 60
            },
            {
                brickRowCount: 7,
                brickColumnCount: 10,
                brickWidth: 40,
                brickHeight: 10,
                ballSpeedMultiplier: 2.2,
                paddleWidthReduction: 80
            }
        ];

        this.reset();
    }

    reset() {
        this.currentLevel = 0;
        this.setupLevel(this.currentLevel);
    }

    setupLevel(levelIndex) {
        const config = this.levelConfigs[levelIndex];

        this.paddleWidth = 100 - config.paddleWidthReduction;
        this.paddleHeight = 15;
        this.paddleX = (this.width - this.paddleWidth) / 2;
        
        this.ballRadius = 10;
        this.ballX = this.width / 2;
        this.ballY = this.height - 50;
        
        this.ballSpeedX = 0;
        this.ballSpeedY = 0;
        
        this.brickRowCount = config.brickRowCount;
        this.brickColumnCount = config.brickColumnCount;
        this.brickWidth = config.brickWidth;
        this.brickHeight = config.brickHeight;
        this.brickPadding = 10;
        this.brickOffsetTop = 30;
        this.brickOffsetLeft = (this.width - (this.brickColumnCount * (this.brickWidth + this.brickPadding) - this.brickPadding)) / 2;
        
        this.score = 0;
        this.lives = 3;
        this.isReady = false;
        
        this.ballSpeedMultiplier = config.ballSpeedMultiplier;
        
        this.createBricks();
    }

    createBricks() {
        this.bricks = [];
        for (let c = 0; c < this.brickColumnCount; c++) {
            this.bricks[c] = [];
            for (let r = 0; r < this.brickRowCount; r++) {
                 
                const brickType = Math.random() < 0.3 ? 2 : 1;  
                this.bricks[c][r] = { 
                    x: 0, 
                    y: 0, 
                    status: brickType,
                    originalStatus: brickType 
                };
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
        this.ballSpeedX = 3 * this.ballSpeedMultiplier;
        this.ballSpeedY = -3 * this.ballSpeedMultiplier;
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
        for (let c = 0; c < this.brickColumnCount; c++) {
            for (let r = 0; r < this.brickRowCount; r++) {
                let b = this.bricks[c][r];
                if (b.status > 0) {
                    if (this.ballX > b.x && 
                        this.ballX < b.x + this.brickWidth && 
                        this.ballY > b.y && 
                        this.ballY < b.y + this.brickHeight) {
                        this.ballSpeedY = -this.ballSpeedY;
                        b.status--;
                        this.score += 10;

                         
                        if (this.isGameWon()) {
                            this.advanceLevel();
                        }
                    }
                }
            }
        }
    }

    isGameWon() {
        for (let c = 0; c < this.brickColumnCount; c++) {
            for (let r = 0; r < this.brickRowCount; r++) {
                if (this.bricks[c][r].status > 0) {
                    return false;
                }
            }
        }
        return true;
    }

    advanceLevel() {
        this.currentLevel++;
        if (this.currentLevel < this.levelConfigs.length) {
            this.setupLevel(this.currentLevel);
            this.draw();
        } else {
            this.gameOver(`Congratulations! You beat all levels! Score: ${this.score}`);
        }
    }

    resetBall() {
        this.ballX = this.width / 2;
        this.ballY = this.height - 50;
        this.ballSpeedX = 3 * this.ballSpeedMultiplier;
        this.ballSpeedY = -3 * this.ballSpeedMultiplier;
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

         
        for (let c = 0; c < this.brickColumnCount; c++) {
            for (let r = 0; r < this.brickRowCount; r++) {
                if (this.bricks[c][r].status > 0) {
                    let brickX = (c * (this.brickWidth + this.brickPadding)) + this.brickOffsetLeft;
                    let brickY = (r * (this.brickHeight + this.brickPadding)) + this.brickOffsetTop;
                    
                    this.bricks[c][r].x = brickX;
                    this.bricks[c][r].y = brickY;
                    
                     
                    const colorMap = {
                        2: `hsl(${c * 20}, 100%, 50%)`,      
                        1: `hsl(${c * 20}, 70%, 50%)`        
                    };
                    this.ctx.fillStyle = colorMap[this.bricks[c][r].status];
                    this.ctx.fillRect(brickX, brickY, this.brickWidth, this.brickHeight);
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
        this.ctx.fillText(`Level: ${this.currentLevel + 1}`, this.width / 2 - 50, 25);

         
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

window.gameConsole.registerGame('brick-breaker', BrickBreakerGame);