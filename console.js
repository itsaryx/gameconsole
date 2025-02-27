class GameConsole {
    constructor() {
        this.games = {};
        this.currentGame = null;
        this.setupControls();
        this.setupGameSelection();
        this.setupPreventDefaultBehaviors();
        this.setupManualAndImport();
    }

    setupPreventDefaultBehaviors() {
         
        document.body.addEventListener('touchstart', (e) => {
            if (e.target.tagName !== 'BUTTON') {
                e.preventDefault();
            }
        }, { passive: false });

        document.body.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });
    }

    registerGame(name, gameClass) {
        this.games[name] = gameClass;
        this.updateGameList();
    }

    updateGameList() {
        const gameList = document.getElementById('game-list');
        gameList.innerHTML = '';
        
        Object.keys(this.games).forEach(gameName => {
            const gameButton = document.createElement('button');
            gameButton.textContent = gameName.toUpperCase();
            gameButton.addEventListener('click', () => {
                this.loadGame(gameName);
                this.closeGameSelection();
            });
            gameList.appendChild(gameButton);
        });
    }

    loadGame(name) {
        const GameClass = this.games[name];
        if (GameClass) {
             
            const gameContainer = document.getElementById('game-container');
            gameContainer.innerHTML = '';

             
            this.currentGame = new GameClass(gameContainer);
            this.currentGame.start();
        }
    }

    setupControls() {
        const controls = {
            up: document.querySelector('.up'),
            down: document.querySelector('.down'),
            left: document.querySelector('.left'),
            right: document.querySelector('.right'),
            a: document.getElementById('btn-a'),
            b: document.getElementById('btn-b'),
            start: document.getElementById('btn-start'),
            select: document.getElementById('btn-select')
        };

         
        Object.entries(controls).forEach(([key, button]) => {
            this.addButtonListeners(button, key);
        });

         
        document.getElementById('btn-game-select').addEventListener('click', () => this.openGameSelection());
    }

    addButtonListeners(button, key) {
        const events = ['touchstart', 'touchend', 'mousedown', 'mouseup'];
        const pressStates = {
            'touchstart': true,
            'mousedown': true,
            'touchend': false,
            'mouseup': false
        };

        events.forEach(eventName => {
            button.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleButtonPress(key, pressStates[eventName]);
            }, { passive: false });
        });
    }

    handleButtonPress(button, isPressed) {
        if (this.currentGame && this.currentGame.handleInput) {
            this.currentGame.handleInput(button, isPressed);
        }
    }

    setupGameSelection() {
        const gameSelectionModal = document.getElementById('game-selection');
        const closeButton = document.querySelector('.close');

        closeButton.onclick = () => this.closeGameSelection();

        window.onclick = (event) => {
            if (event.target == gameSelectionModal) {
                this.closeGameSelection();
            }
        };
    }

    openGameSelection() {
        document.getElementById('game-selection').style.display = 'block';
    }

    closeGameSelection() {
        document.getElementById('game-selection').style.display = 'none';
    }

    setupManualAndImport() {
         
        document.getElementById('btn-manual').addEventListener('click', () => {
            document.getElementById('app-manual').style.display = 'block';
        });

         
        document.querySelector('#app-manual .close').addEventListener('click', () => {
            document.getElementById('app-manual').style.display = 'none';
        });

         
        document.getElementById('btn-import').addEventListener('click', () => {
            document.getElementById('import-game').style.display = 'block';
        });

         
        document.querySelector('#import-game .close').addEventListener('click', () => {
            document.getElementById('import-game').style.display = 'none';
        });

         
        document.getElementById('import-btn').addEventListener('click', () => {
            const fileInput = document.getElementById('game-file-input');
            const file = fileInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                         
                        const script = document.createElement('script');
                        script.textContent = e.target.result;
                        document.body.appendChild(script);
                        
                         
                        document.getElementById('import-game').style.display = 'none';
                        alert('Game imported successfully!');
                    } catch (error) {
                        alert('Error importing game: ' + error.message);
                    }
                };
                reader.readAsText(file);
            }
        });
    }
}

 
window.gameConsole = new GameConsole();