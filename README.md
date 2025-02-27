# Game Console

## Overview
A retro-themed game console with custom game support. This framework allows developers to create interactive applications easily.

## Getting Started

### Prerequisites
- Basic understanding of JavaScript
- HTML5 Canvas knowledge (for graphical apps)

### Framework Components
- `BaseGame` class: Core game/app template
- `GameConsole` class: App management and control system
- Responsive touch and keyboard controls

## Creating a New App

1. Extend the `BaseGame` class
2. Implement required methods:
   - `constructor(container)`: Initialize app
   - `start()`: Begin app logic
   - `handleInput(button, isPressed)`: Handle user controls
   - Optional: `resumeGame()`: Handle game/app resumption

## Game By Default
- Tetris
- Snake 
- Mario
- Space Invader
- Ball Breaker


### Example App Template

```javascript
class MyApp extends BaseGame {
    constructor(container) {
        super(container);
        // Initialize app-specific elements
    }

    start() {
        // Start app logic
        // Set up game loop, initialize state
    }

    handleInput(button, isPressed) {
        // Handle button presses
        // Implement app-specific control logic
    }

    resumeGame() {
        // Restart game loop or refresh state
        this.gameLoop = setInterval(...);
    }
}

// Register the app with the console
window.gameConsole.registerGame('myapp', MyApp);


