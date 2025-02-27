class PongGame extends BaseGame {
    constructor(container) {
        super(container);
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // New AI difficulty levels
        this.aiDifficulty = [
            { speed: 2, precision: 0.3 },   // Easy
            { speed: 3, precision: 0.5 },   // Medium
            { speed: 4, precision: 0.7 },   // Hard
            { speed: 5, precision: 0.9 }    // Expert
        ];
        this.currentDifficulty = 1;  // Default to medium

        this.reset();
    }

    reset() {
        this.paddleHeight = 100;
        this.paddleWidth = 15;
        this.ballSize = 15;

        this.player1Y = this.height / 2 - this.paddleHeight / 2;
        this.player2Y = this.height / 2 - this.paddleHeight / 2;

        this.ballX = this.width / 2;
        this.ballY = this.height / 2;

        this.ballSpeedX = 0;
        this.ballSpeedY = 0;

        this.player1Score = 0;
        this.player2Score = 0;

        this.currentDifficulty = 1;  // Reset to medium difficulty
        this.isReady = false;
    }

    start() {
        this.reset();
        this.draw();
    }

    startGame() {
        if (this.isReady) return;
        
        this.isReady = true;
        this.resetBall(1);
        this.gameLoop = setInterval(() => this.update(), 16);
    }

    update() {
        if (!this.isReady || this.isGameOver) return;

        this.moveBall();
        this.moveAIPaddle();
        this.checkCollisions();
        this.draw();
    }

    moveBall() {
        this.ballX += this.ballSpeedX;
        this.ballY += this.ballSpeedY;
    }

    moveAIPaddle() {
        const difficulty = this.aiDifficulty[this.currentDifficulty];
        const aiSpeed = difficulty.speed;
        const precision = difficulty.precision;

        const centerOfPaddle = this.player2Y + this.paddleHeight / 2;
        
        // Predict ball's future position with some uncertainty
        let predictedY = this.ballY;
        
        // Add some randomness based on difficulty
        if (Math.random() > precision) {
            // Introduce some unpredictability
            predictedY += (Math.random() - 0.5) * 50;
        }

        // Move paddle towards predicted position
        if (predictedY > centerOfPaddle) {
            this.player2Y = Math.min(this.height - this.paddleHeight, this.player2Y + aiSpeed);
        } else if (predictedY < centerOfPaddle) {
            this.player2Y = Math.max(0, this.player2Y - aiSpeed);
        }
    }

    checkCollisions() {
        // Vertical wall bounce
        if (this.ballY <= 0 || this.ballY >= this.height - this.ballSize) {
            this.ballSpeedY = -this.ballSpeedY;
        }

        // Player 1 paddle collision
        if (
            this.ballX <= this.paddleWidth &&
            this.ballY >= this.player1Y &&
            this.ballY <= this.player1Y + this.paddleHeight
        ) {
            this.ballSpeedX = Math.abs(this.ballSpeedX);
            this.adjustBallTrajectory(this.player1Y);
        }

        // Player 2 paddle collision
        if (
            this.ballX >= this.width - this.paddleWidth - this.ballSize &&
            this.ballY >= this.player2Y &&
            this.ballY <= this.player2Y + this.paddleHeight
        ) {
            this.ballSpeedX = -Math.abs(this.ballSpeedX);
            this.adjustBallTrajectory(this.player2Y);
        }

        // Scoring
        if (this.ballX <= 0) {
            this.player2Score++;
            this.resetBall(1);
        }
        if (this.ballX >= this.width - this.ballSize) {
            this.player1Score++;
            this.resetBall(-1);
        }
    }

    adjustBallTrajectory(paddleY) {
        const ballRelativeY = this.ballY - paddleY;
        const paddleCenter = this.paddleHeight / 2;
        const angleModifier = (ballRelativeY - paddleCenter) / (this.paddleHeight / 2);
        this.ballSpeedY += angleModifier * 2;
    }

    resetBall(direction) {
        this.ballX = this.width / 2;
        this.ballY = this.height / 2;
        this.ballSpeedX = 5 * direction;
        this.ballSpeedY = Math.random() * 6 - 3;
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

        const paddleSpeed = 20;
        switch(button) {
            case 'up': 
                this.player1Y = Math.max(0, this.player1Y - paddleSpeed);
                break;
            case 'down':
                this.player1Y = Math.min(this.height - this.paddleHeight, this.player1Y + paddleSpeed);
                break;
        }

        // Add difficulty change functionality
        if (button === 'a' && isPressed) {
            // Cycle through AI difficulties
            this.currentDifficulty = (this.currentDifficulty + 1) % this.aiDifficulty.length;
        }
    }

    restart() {
        // Ensure game loop is cleared
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

    gameOver(message) {
        // Stop game loop
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }

        // Set game over state
        this.isGameOver = true;
        this.isReady = false;

        // Show game over message
        const gameMessage = document.getElementById('game-message');
        gameMessage.textContent = message;
        this.gameOverlay.classList.remove('hidden');
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Enhanced background
        const gradient = this.ctx.createLinearGradient(0, 0, this.width, this.height);
        gradient.addColorStop(0, 'rgba(20,40,80,0.9)');
        gradient.addColorStop(1, 'rgba(10,20,40,0.9)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Centerline
        this.ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        this.ctx.beginPath();
        this.ctx.setLineDash([10, 10]);
        this.ctx.moveTo(this.width / 2, 0);
        this.ctx.lineTo(this.width / 2, this.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // Paddles with gradient
        const player1Gradient = this.ctx.createLinearGradient(0, this.player1Y, this.paddleWidth, this.player1Y + this.paddleHeight);
        player1Gradient.addColorStop(0, 'rgba(0,255,0,0.8)');
        player1Gradient.addColorStop(1, 'rgba(0,150,0,0.8)');
        this.ctx.fillStyle = player1Gradient;
        this.ctx.fillRect(0, this.player1Y, this.paddleWidth, this.paddleHeight);

        const player2Gradient = this.ctx.createLinearGradient(this.width - this.paddleWidth, this.player2Y, this.width, this.player2Y + this.paddleHeight);
        player2Gradient.addColorStop(0, 'rgba(255,0,0,0.8)');
        player2Gradient.addColorStop(1, 'rgba(150,0,0,0.8)');
        this.ctx.fillStyle = player2Gradient;
        this.ctx.fillRect(this.width - this.paddleWidth, this.player2Y, this.paddleWidth, this.paddleHeight);

        // Ball with glow
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = 'rgba(255,255,255,0.5)';
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(this.ballX, this.ballY, this.ballSize, this.ballSize);
        this.ctx.shadowBlur = 0;

        // Score
        this.ctx.fillStyle = 'rgba(255,255,255,0.8)';
        this.ctx.font = '24px "Press Start 2P"';
        this.ctx.fillText(this.player1Score.toString(), this.width / 4, 50);
        this.ctx.fillText(this.player2Score.toString(), 3 * this.width / 4, 50);

        // Display current AI difficulty
        const difficultyNames = ['Easy', 'Medium', 'Hard', 'Expert'];
        this.ctx.fillStyle = 'rgba(255,255,255,0.8)';
        this.ctx.font = '12px "Press Start 2P"';
        this.ctx.fillText(`AI: ${difficultyNames[this.currentDifficulty]}`, 10, 50);

        // Display "Press START" message if not ready
        if (!this.isReady && !this.isGameOver) {
            this.ctx.fillStyle = 'rgba(255,255,255,0.6)';
            this.ctx.font = '20px "Press Start 2P"';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Press START', this.width / 2, this.height / 2);
            this.ctx.textAlign = 'left';
        }
    }
}

window.gameConsole.registerGame('pong', PongGame);