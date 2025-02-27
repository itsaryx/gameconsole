class BaseGame {
    constructor(container) {
        this.container = container;
        this.width = container.clientWidth;
        this.height = container.clientHeight;
        this.gameOverlay = document.getElementById('game-overlay');
        this.pauseOverlay = document.getElementById('pause-overlay');
        this.restartBtn = document.getElementById('restart-btn');
        this.pauseBtn = document.getElementById('btn-pause');
        
        this.restartBtn.addEventListener('click', () => this.restart());
        this.pauseBtn.addEventListener('click', () => this.togglePause());

        this.isPaused = false;
        this.isGameOver = false;
        this.keyboardMap = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right',
            'KeyZ': 'a',
            'KeyX': 'b',
            'KeyC': 'a',
            'Enter': 'start',
            'Space': 'start',  
            'Escape': 'select',
            'ControlLeft': 'a',
            'ControlRight': 'a',
            'ShiftLeft': 'b',
            'ShiftRight': 'b'
        };

        // Track pressed keys
        this.pressedKeys = new Set();

        this.setupKeyboardControls();
    }

    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            const preventDefaultKeys = ['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
            if (preventDefaultKeys.includes(e.code)) {
                e.preventDefault();
            }

            if (this.isGameOver && (e.code === 'Enter' || e.code === 'Space')) {
                this.restart();
                return;
            }

            const mappedButton = this.keyboardMap[e.code];
            if (mappedButton) {
                // Add to pressed keys set
                this.pressedKeys.add(mappedButton);
                this.handleInput(mappedButton, true);
            }
        });

        document.addEventListener('keyup', (e) => {
            const mappedButton = this.keyboardMap[e.code];
            if (mappedButton) {
                // Remove from pressed keys set
                this.pressedKeys.delete(mappedButton);
                this.handleInput(mappedButton, false);
            }
        });

        // Continuous movement for held keys
        this.continuousMovementInterval = setInterval(() => {
            if (this.isPaused || this.isGameOver) return;

            // Check for continuous movement keys
            const movementKeys = ['left', 'right', 'up', 'down'];
            movementKeys.forEach(key => {
                if (this.pressedKeys.has(key)) {
                    this.handleInput(key, true);
                }
            });
        }, 50);  // Adjust interval for movement speed
    }

    start() {
        this.isGameOver = false;
        console.log('Game started');
    }

    // Modify restart to clear continuous movement interval
    restart() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }

        // Clear pressed keys
        this.pressedKeys.clear();

        this.gameOverlay.classList.add('hidden');
        this.pauseOverlay.classList.add('hidden');
        
        this.isPaused = false;
        this.isGameOver = false;

        this.start();
    }

    togglePause() {
        if (this.isGameOver) return;

        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            this.pauseOverlay.classList.remove('hidden');
            clearInterval(this.gameLoop);
        } else {
            this.pauseOverlay.classList.add('hidden');
            this.resumeGame();
        }
    }

    resumeGame() {
        console.log('Resuming game');
    }

    handleInput(button, isPressed) {
        if (this.isPaused || this.isGameOver) return;
        console.log(`Button ${button} ${isPressed ? 'pressed' : 'released'}`);
    }

    gameOver(message = 'Game Over') {
        this.isGameOver = true;
        
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }

        const gameMessage = document.getElementById('game-message');
        gameMessage.textContent = message;
        this.gameOverlay.classList.remove('hidden');
    }

    // Clean up interval when game is destroyed
    destroy() {
        if (this.continuousMovementInterval) {
            clearInterval(this.continuousMovementInterval);
        }
    }
}