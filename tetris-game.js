class TetrisGame extends BaseGame {
    constructor(container) {
        super(container);
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.gridSize = 25;  
        this.cols = Math.floor(this.width / this.gridSize);
        this.rows = Math.floor(this.height / this.gridSize);
        
        // Expanded keyboard mapping with more flexible rotation
        this.keyboardMap = {
            ...this.keyboardMap,
            'KeyZ': 'a',    // Z key for rotate left
            'KeyX': 'b',    // X key for rotate right
            'KeyC': 'a',    // C key as alternative rotate left
            'KeyV': 'b',    // V key as alternative rotate right
            'ArrowUp': 'rotate',  // Up key for shape rotation
            'Space': 'drop'  // Spacebar to drop piece instantly
        };
        
        this.reset();

        // Soft drop variables
        this.softDropMultiplier = 10;  // Speed up drop when down key is pressed
        this.softDropTimer = 0;
        this.softDropInterval = 50;  // More frequent checks for soft drop
    }

    reset() {
        this.grid = Array(this.rows).fill().map(() => Array(this.cols).fill(0));
        this.currentPiece = null;
        this.pieceX = 0;
        this.pieceY = 0;
        this.score = 0;
        this.level = 1;
        this.dropSpeed = 700;  
        this.isReady = false;
        this.isGameOver = false;
        this.lastDropTime = 0;
        
        this.pieces = [
            [[1,1,1,1]],                 
            [[1,1],[1,1]],                
            [[1,1,1],[0,1,0]],            
            [[1,1,1],[1,0,0]],            
            [[1,1,1],[0,0,1]],            
            [[1,1,0],[0,1,1]],            
            [[0,1,1],[1,1,0]]             
        ];

        this.pieceColors = [
            'rgba(0,255,255,0.8)',    
            'rgba(255,255,0,0.8)',    
            'rgba(128,0,128,0.8)',    
            'rgba(255,165,0,0.8)',    
            'rgba(0,0,255,0.8)',      
            'rgba(0,255,0,0.8)',      
            'rgba(255,0,0,0.8)'       
        ];
    }

    start() {
        this.reset();
        this.draw();
    }

    startGame() {
        if (this.isReady || this.isGameOver) return;
        
        this.isReady = true;
        this.spawnPiece();
        
        // Use requestAnimationFrame for smoother gameplay
        this.lastDropTime = performance.now();
        this.gameLoop = requestAnimationFrame((time) => this.update(time));
    }

    spawnPiece() {
        const pieceIndex = Math.floor(Math.random() * this.pieces.length);
        this.currentPiece = this.pieces[pieceIndex];
        this.currentColor = this.pieceColors[pieceIndex];
        this.pieceX = Math.floor(this.cols / 2) - Math.floor(this.currentPiece[0].length / 2);
        this.pieceY = 0;

        if (!this.canMove(this.currentPiece, this.pieceX, this.pieceY)) {
            this.gameOver(`Game Over! Score: ${this.score}`);
        }
    }

    update(time) {
        if (!this.isReady || this.isGameOver) return;

        const isSoftDropping = this.pressedKeys.has('down');
        
        // Adjust drop speed based on soft drop
        const currentDropSpeed = isSoftDropping 
            ? this.dropSpeed / this.softDropMultiplier 
            : this.dropSpeed;

        // Check if it's time to drop the piece
        if (time - this.lastDropTime > currentDropSpeed) {
            if (this.canMove(this.currentPiece, this.pieceX, this.pieceY + 1)) {
                this.pieceY++;
            } else {
                this.placePiece();
                const linesCleared = this.clearLines();
                this.updateScore(linesCleared);
                this.spawnPiece();
            }
            this.lastDropTime = time;
        }

        // Enhanced soft drop for continuous falling
        if (isSoftDropping) {
            this.softDropTimer += time - this.lastDropTime;
            
            // Additional soft drop logic
            while (this.softDropTimer > this.softDropInterval) {
                if (this.canMove(this.currentPiece, this.pieceX, this.pieceY + 1)) {
                    this.pieceY++;
                }
                this.softDropTimer -= this.softDropInterval;
            }
        }

        this.draw();

        // Continue the game loop
        this.gameLoop = requestAnimationFrame((newTime) => this.update(newTime));
    }

    updateScore(linesCleared) {
        const scoreMultipliers = [0, 40, 100, 300, 1200];
        this.score += scoreMultipliers[linesCleared] * this.level;

        if (this.score > this.level * 1000) {
            this.level++;
            // Reduce drop speed, with a minimum limit
            this.dropSpeed = Math.max(100, this.dropSpeed - 50);
        }
    }

    clearLines() {
        let linesCleared = 0;
        for (let y = this.rows - 1; y >= 0; y--) {
            if (this.grid[y].every(cell => cell)) {
                this.grid.splice(y, 1);
                this.grid.unshift(Array(this.cols).fill(0));
                linesCleared++;
                y++; 
            }
        }
        return linesCleared;
    }

    canMove(piece, offsetX, offsetY) {
        for (let y = 0; y < piece.length; y++) {
            for (let x = 0; x < piece[y].length; x++) {
                if (piece[y][x]) {
                    const newX = offsetX + x;
                    const newY = offsetY + y;
                    
                    if (newX < 0 || newX >= this.cols || 
                        newY >= this.rows || 
                        (newY >= 0 && this.grid[newY][newX])) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    placePiece() {
        for (let y = 0; y < this.currentPiece.length; y++) {
            for (let x = 0; x < this.currentPiece[y].length; x++) {
                if (this.currentPiece[y][x]) {
                    this.grid[this.pieceY + y][this.pieceX + x] = 1;
                }
            }
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
                if (this.canMove(this.currentPiece, this.pieceX - 1, this.pieceY)) {
                    this.pieceX--;
                }
                break;
            case 'right':
                if (this.canMove(this.currentPiece, this.pieceX + 1, this.pieceY)) {
                    this.pieceX++;
                }
                break;
            case 'down':
                // Instant drop to bottom with scoring
                while (this.canMove(this.currentPiece, this.pieceX, this.pieceY + 1)) {
                    this.pieceY++;
                }
                this.placePiece();
                const linesCleared = this.clearLines();
                this.updateScore(linesCleared);
                this.spawnPiece();
                break;
            case 'drop':  // Spacebar support for instant drop
                while (this.canMove(this.currentPiece, this.pieceX, this.pieceY + 1)) {
                    this.pieceY++;
                }
                this.placePiece();
                const droppedLines = this.clearLines();
                this.updateScore(droppedLines);
                this.spawnPiece();
                break;
            case 'a':  // Rotate left
                const rotatedLeft = this.rotatePiece(this.currentPiece, -1);
                if (this.canMove(rotatedLeft, this.pieceX, this.pieceY)) {
                    this.currentPiece = rotatedLeft;
                }
                break;
            case 'b':  // Rotate right
                const rotatedRight = this.rotatePiece(this.currentPiece, 1);
                if (this.canMove(rotatedRight, this.pieceX, this.pieceY)) {
                    this.currentPiece = rotatedRight;
                }
                break;
            case 'rotate':  // Up key rotation
                const rotatedDefault = this.rotatePiece(this.currentPiece, 1);
                if (this.canMove(rotatedDefault, this.pieceX, this.pieceY)) {
                    this.currentPiece = rotatedDefault;
                }
                break;
        }
        this.draw();
    }

    rotatePiece(piece, direction = 1) {
        const rotated = [];
        if (direction > 0) {
            // Clockwise rotation
            for (let x = 0; x < piece[0].length; x++) {
                const newRow = [];
                for (let y = piece.length - 1; y >= 0; y--) {
                    newRow.push(piece[y][x]);
                }
                rotated.push(newRow);
            }
        } else {
            // Counter-clockwise rotation
            for (let x = piece[0].length - 1; x >= 0; x--) {
                const newRow = [];
                for (let y = 0; y < piece.length; y++) {
                    newRow.push(piece[y][x]);
                }
                rotated.push(newRow);
            }
        }
        return rotated;
    }

    restart() {
        // Stop the game loop
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
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

        this.grid.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) {
                    this.ctx.fillStyle = 'rgba(100,100,100,0.8)';
                    this.ctx.fillRect(
                        x * this.gridSize, 
                        y * this.gridSize, 
                        this.gridSize - 1, 
                        this.gridSize - 1
                    );
                }
            });
        });

        if (this.currentPiece) {
            this.ctx.fillStyle = this.currentColor;
            for (let y = 0; y < this.currentPiece.length; y++) {
                for (let x = 0; x < this.currentPiece[y].length; x++) {
                    if (this.currentPiece[y][x]) {
                        this.ctx.fillRect(
                            (this.pieceX + x) * this.gridSize, 
                            (this.pieceY + y) * this.gridSize, 
                            this.gridSize - 1, 
                            this.gridSize - 1
                        );
                    }
                }
            }
        }

        this.ctx.fillStyle = 'rgba(255,255,255,0.8)';
        this.ctx.font = '16px "Press Start 2P"';
        this.ctx.fillText(`Score: ${this.score}`, 10, 25);
        this.ctx.fillText(`Level: ${this.level}`, 10, 50);

        // Display "Press START" message if not ready
        if (!this.isReady && !this.isGameOver) {
            this.ctx.fillStyle = 'rgba(255,255,255,0.6)';
            this.ctx.font = '20px "Press Start 2P"';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Press START', this.width / 2, this.height / 2);
            this.ctx.textAlign = 'left';
        }
    }

    gameOver(message) {
        // Stop the game loop
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
        }

        this.isGameOver = true;
        this.isReady = false;

        const gameMessage = document.getElementById('game-message');
        gameMessage.textContent = message;
        this.gameOverlay.classList.remove('hidden');
    }
}

window.gameConsole.registerGame('tetris', TetrisGame);