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
        
         
        this.keyboardMap = {
            ...this.keyboardMap,
            'KeyZ': 'a',     
            'KeyX': 'b',     
            'KeyC': 'a',     
            'KeyV': 'b',     
            'ArrowUp': 'rotate',   
            'Space': 'drop'   
        };
        
        this.reset();

         
        this.softDropMultiplier = 10;   
        this.softDropTimer = 0;
        this.softDropInterval = 50;   
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
        
         
        const currentDropSpeed = isSoftDropping 
            ? this.dropSpeed / this.softDropMultiplier 
            : this.dropSpeed;

         
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

         
        if (isSoftDropping) {
            this.softDropTimer += time - this.lastDropTime;
            
             
            while (this.softDropTimer > this.softDropInterval) {
                if (this.canMove(this.currentPiece, this.pieceX, this.pieceY + 1)) {
                    this.pieceY++;
                }
                this.softDropTimer -= this.softDropInterval;
            }
        }

        this.draw();

         
        this.gameLoop = requestAnimationFrame((newTime) => this.update(newTime));
    }

    updateScore(linesCleared) {
        const scoreMultipliers = [0, 40, 100, 300, 1200];
        this.score += scoreMultipliers[linesCleared] * this.level;

        if (this.score > this.level * 1000) {
            this.level++;
             
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
                 
                while (this.canMove(this.currentPiece, this.pieceX, this.pieceY + 1)) {
                    this.pieceY++;
                }
                this.placePiece();
                const linesCleared = this.clearLines();
                this.updateScore(linesCleared);
                this.spawnPiece();
                break;
            case 'drop':   
                while (this.canMove(this.currentPiece, this.pieceX, this.pieceY + 1)) {
                    this.pieceY++;
                }
                this.placePiece();
                const droppedLines = this.clearLines();
                this.updateScore(droppedLines);
                this.spawnPiece();
                break;
            case 'a':   
                const rotatedLeft = this.rotatePiece(this.currentPiece, -1);
                if (this.canMove(rotatedLeft, this.pieceX, this.pieceY)) {
                    this.currentPiece = rotatedLeft;
                }
                break;
            case 'b':   
                const rotatedRight = this.rotatePiece(this.currentPiece, 1);
                if (this.canMove(rotatedRight, this.pieceX, this.pieceY)) {
                    this.currentPiece = rotatedRight;
                }
                break;
            case 'rotate':   
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
             
            for (let x = 0; x < piece[0].length; x++) {
                const newRow = [];
                for (let y = piece.length - 1; y >= 0; y--) {
                    newRow.push(piece[y][x]);
                }
                rotated.push(newRow);
            }
        } else {
             
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
         
        if (this.gameLoop) {
            cancelAnimationFrame(this.gameLoop);
        }

         
        this.reset();
        
         
        this.gameOverlay.classList.add('hidden');
        
         
        this.isGameOver = false;
        this.isReady = false;
        
         
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

         
        if (!this.isReady && !this.isGameOver) {
            this.ctx.fillStyle = 'rgba(255,255,255,0.6)';
            this.ctx.font = '20px "Press Start 2P"';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Press START', this.width / 2, this.height / 2);
            this.ctx.textAlign = 'left';
        }
    }

    gameOver(message) {
         
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