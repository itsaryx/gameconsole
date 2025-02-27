class SnakeGame extends BaseGame {
    constructor(container) {
        super(container);
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.gridSize = 20;  
        this.cellsX = Math.floor(this.width / this.gridSize);
        this.cellsY = Math.floor(this.height / this.gridSize);
        
        this.reset();
    }

    reset() {
        const startX = Math.floor(this.cellsX / 2);
        const startY = Math.floor(this.cellsY / 2);
        this.snake = [
            {x: startX, y: startY},
            {x: startX - 1, y: startY},
            {x: startX - 2, y: startY}
        ];
        this.food = this.generateFood();
        this.dx = 1;
        this.dy = 0;
        this.score = 0;
        this.speed = 200;
        this.isReady = false;
        
         
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }
    }

    start() {
        this.reset();
        this.draw();  
    }

    startGame() {
        if (this.isReady) return;
        
        this.isReady = true;
        this.startGameLoop();
    }

    startGameLoop() {
         
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }

         
        this.gameLoop = setInterval(() => this.update(), this.speed);
    }

    generateFood() {
        let attempts = 0;
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * this.cellsX),
                y: Math.floor(Math.random() * this.cellsY)
            };
            attempts++;
        } while (
            this.snake.some(segment => 
                segment.x === newFood.x && segment.y === newFood.y
            ) && attempts < 100
        );
        return newFood;
    }

    handleInput(button, isPressed) {
        if (!isPressed) return;

         
        if (button === 'start') {
            if (!this.isReady) {
                this.startGame();
            }
            return;
        }

         
        if (this.isGameOver || !this.isReady) return;

        switch(button) {
            case 'up': 
                if (this.dy !== 1) {
                    this.dx = 0;
                    this.dy = -1;
                }
                break;
            case 'down':
                if (this.dy !== -1) {
                    this.dx = 0;
                    this.dy = 1;
                }
                break;
            case 'left':
                if (this.dx !== 1) {
                    this.dx = -1;
                    this.dy = 0;
                }
                break;
            case 'right':
                if (this.dx !== -1) {
                    this.dx = 1;
                    this.dy = 0;
                }
                break;
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

    update() {
        if (!this.isReady || this.isGameOver) return;

        const head = {
            x: this.snake[0].x + this.dx,
            y: this.snake[0].y + this.dy
        };

        if (
            head.x < 0 || head.x >= this.cellsX ||
            head.y < 0 || head.y >= this.cellsY ||
            this.snake.slice(0, -1).some(segment => 
                segment.x === head.x && segment.y === head.y
            )
        ) {
            return this.gameOver(`Game Over! Score: ${this.score}`);
        }

        this.snake.unshift(head);

        if (head.x === this.food.x && head.y === this.food.y) {
            this.score++;
            this.food = this.generateFood();
            
            if (this.speed > 50) {
                clearInterval(this.gameLoop);
                this.speed -= 10;
                this.startGameLoop();
            }
        } else {
            this.snake.pop();
        }

        this.draw();
    }

    gameOver(message) {
         
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }

         
        this.isGameOver = true;
        this.isReady = false;

         
        const gameMessage = document.getElementById('game-message');
        gameMessage.textContent = message;
        this.gameOverlay.classList.remove('hidden');
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        const gradient = this.ctx.createLinearGradient(0, 0, this.width, this.height);
        gradient.addColorStop(0, 'rgba(20,40,80,0.9)');
        gradient.addColorStop(1, 'rgba(10,20,40,0.9)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.strokeStyle = 'rgba(50,100,200,0.2)';
        this.ctx.lineWidth = 0.5;
        for (let x = 0; x <= this.width; x += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.height);
            this.ctx.stroke();
        }
        for (let y = 0; y <= this.height; y += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.width, y);
            this.ctx.stroke();
        }

        this.snake.forEach((segment, index) => {
            const gradient = this.ctx.createLinearGradient(
                segment.x * this.gridSize, 
                segment.y * this.gridSize, 
                segment.x * this.gridSize + this.gridSize, 
                segment.y * this.gridSize + this.gridSize
            );
            gradient.addColorStop(0, index === 0 ? 'rgba(0,255,0,1)' : 'rgba(50,200,50,0.9)');
            gradient.addColorStop(1, index === 0 ? 'rgba(0,200,0,0.9)' : 'rgba(0,150,0,0.7)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(
                segment.x * this.gridSize, 
                segment.y * this.gridSize, 
                this.gridSize - 1, 
                this.gridSize - 1
            );
        });

        const foodPulse = Math.sin(Date.now() * 0.01) * 0.2 + 1;
        this.ctx.shadowBlur = 10 * foodPulse;
        this.ctx.shadowColor = 'rgba(255,50,50,0.7)';
        this.ctx.fillStyle = 'rgba(255,50,50,0.8)';
        this.ctx.fillRect(
            this.food.x * this.gridSize, 
            this.food.y * this.gridSize, 
            this.gridSize - 1, 
            this.gridSize - 1
        );
        this.ctx.shadowBlur = 0;

        this.ctx.fillStyle = 'rgba(255,255,255,0.8)';
        this.ctx.font = '16px "Press Start 2P"';
        this.ctx.fillText(`Score: ${this.score}`, 10, 25);

         
        if (!this.isReady && !this.isGameOver) {
            this.ctx.fillStyle = 'rgba(255,255,255,0.6)';
            this.ctx.font = '20px "Press Start 2P"';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Press START', this.width / 2, this.height / 2);
            this.ctx.textAlign = 'left';
        }
    }
}

window.gameConsole.registerGame('snake', SnakeGame);