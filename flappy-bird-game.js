class FlappyBird extends BaseGame {
    constructor(container) {
        super(container);
         
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        this.canvas.width = this.width;
        this.canvas.height = this.height;

         
        this.state = 'menu';

         
        this.difficulties = ['Easy', 'Medium', 'Hard'];
        this.selectedDifficultyIndex = 1; 

         
        this.settings = {
            Easy: {
                gravity: 0.25,
                flapStrength: -4.5,
                pipeGap: 150,
                pipeSpeed: 2,
                pipeFrequency: 90   
            },
            Medium: {
                gravity: 0.4,
                flapStrength: -4,
                pipeGap: 120,
                pipeSpeed: 3,
                pipeFrequency: 70
            },
            Hard: {
                gravity: 0.5,
                flapStrength: -3.5,
                pipeGap: 100,
                pipeSpeed: 4,
                pipeFrequency: 50
            }
        };

        this.reset();
    }

    reset() {
         
        this.bird = {
            x: this.width / 4,
            y: this.height / 2,
            radius: 10,
            velocity: 0
        };

         
        const difficulty = this.difficulties[this.selectedDifficultyIndex];
        const settings = this.settings[difficulty];
        this.gravity = settings.gravity;
        this.flapStrength = settings.flapStrength;
        this.pipeGap = settings.pipeGap;
        this.pipeSpeed = settings.pipeSpeed;
        this.pipeFrequency = settings.pipeFrequency;

         
        this.pipes = [];
        this.frameCount = 0;

         
        this.score = 0;

         
        this.started = false;

         
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }
    }

    start() {
         
        this.reset();
        this.state = 'menu';
        this.draw();
    }

    startGame() {
        if (this.state === 'playing') return;
        this.reset();
        this.state = 'playing';
         
        this.gameLoop = setInterval(() => {
            this.update();
            this.draw();
        }, 16);
    }

    update() {
        if (this.state !== 'playing') return;
        
         
        if (!this.started) {
            return;
        }

         
        this.bird.velocity += this.gravity;
        this.bird.y += this.bird.velocity;

         
        this.frameCount++;
        if (this.frameCount % this.pipeFrequency === 0) {
            this.addPipe();
        }

         
        for (let i = this.pipes.length - 1; i >= 0; i--) {
            this.pipes[i].x -= this.pipeSpeed;
            if (this.pipes[i].x + this.pipes[i].width < 0) {
                this.pipes.splice(i, 1);
                 
                this.score++;
            }
        }

         
        if (this.bird.y + this.bird.radius > this.height || this.bird.y - this.bird.radius < 0) {
            this.gameOver();
            return;
        }

         
        for (let pipe of this.pipes) {
            if (this.collidesWithPipe(this.bird, pipe)) {
                this.gameOver();
                return;
            }
        }
    }

    addPipe() {
         
        const pipeWidth = 40;
         
        const minGapY = 40;
        const maxGapY = this.height - this.pipeGap - 40;
        const gapY = Math.floor(Math.random() * (maxGapY - minGapY + 1)) + minGapY;

         
        const pipe = {
            x: this.width,
            width: pipeWidth,
            gapY: gapY,
            gapHeight: this.pipeGap
        };
        this.pipes.push(pipe);
    }

    collidesWithPipe(bird, pipe) {
         
        if (this.circleRectCollision(bird.x, bird.y, bird.radius, pipe.x, 0, pipe.width, pipe.gapY)) {
            return true;
        }
        if (this.circleRectCollision(bird.x, bird.y, bird.radius, pipe.x, pipe.gapY + pipe.gapHeight, pipe.width, this.height - (pipe.gapY + pipe.gapHeight))) {
            return true;
        }
        return false;
    }

     
    circleRectCollision(cx, cy, radius, rx, ry, rw, rh) {
        let closestX = Math.max(rx, Math.min(cx, rx + rw));
        let closestY = Math.max(ry, Math.min(cy, ry + rh));
        let dx = cx - closestX;
        let dy = cy - closestY;
        return (dx * dx + dy * dy) < (radius * radius);
    }

    gameOver() {
        clearInterval(this.gameLoop);
        this.state = 'gameover';
        this.draw();  
    }

    handleInput(button, isPressed) {
        if (!isPressed) return;   

        if (this.state === 'menu') {
             
            if (button === 'up' || button === 'left') {
                this.selectedDifficultyIndex = (this.selectedDifficultyIndex - 1 + this.difficulties.length) % this.difficulties.length;
                this.draw();
            } else if (button === 'down' || button === 'right') {
                this.selectedDifficultyIndex = (this.selectedDifficultyIndex + 1) % this.difficulties.length;
                this.draw();
            }
             
            else if (button === 'start' || button === 'select') {
                this.startGame();
            }
        } else if (this.state === 'playing') {
             
            if (button.toLowerCase() === 'b') {
                if (!this.started) {
                    this.started = true;
                }
                this.bird.velocity = this.flapStrength;
            }
        } else if (this.state === 'gameover') {
             
            if (button === 'start') {
                this.start();
            }
        }
    }

    draw() {
         
        this.ctx.clearRect(0, 0, this.width, this.height);

         
        this.ctx.fillStyle = '#70c5ce';
        this.ctx.fillRect(0, 0, this.width, this.height);

         
        this.ctx.fillStyle = '#0f0';
        for (let pipe of this.pipes) {
             
            this.ctx.fillRect(pipe.x, 0, pipe.width, pipe.gapY);
             
            this.ctx.fillRect(pipe.x, pipe.gapY + pipe.gapHeight, pipe.width, this.height - (pipe.gapY + pipe.gapHeight));
        }

         
        this.ctx.fillStyle = '#ff0';
        this.ctx.beginPath();
        this.ctx.arc(this.bird.x, this.bird.y, this.bird.radius, 0, Math.PI * 2);
        this.ctx.fill();

         
        if (this.state === 'playing' || this.state === 'gameover') {
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '24px sans-serif';
            this.ctx.fillText(`Score: ${this.score}`, 10, 30);
        }

         
        if (this.state === 'playing' && !this.started) {
            this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
            this.ctx.font = '20px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Press B to flap/start!', this.width / 2, this.height / 2);
            this.ctx.textAlign = 'left';
        }

         
        if (this.state === 'menu') {
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '28px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Select Difficulty', this.width / 2, this.height / 3);
            for (let i = 0; i < this.difficulties.length; i++) {
                this.ctx.fillStyle = (i === this.selectedDifficultyIndex) ? '#ff0' : '#fff';
                this.ctx.fillText(this.difficulties[i], this.width / 2, this.height / 2 + i * 40);
            }
            this.ctx.font = '20px sans-serif';
            this.ctx.fillStyle = '#fff';
            this.ctx.fillText('Press START to begin', this.width / 2, this.height - 50);
            this.ctx.textAlign = 'left';
        }

         
        if (this.state === 'gameover') {
            this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '36px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Game Over', this.width / 2, this.height / 2 - 20);
            this.ctx.font = '24px sans-serif';
            this.ctx.fillText(`Score: ${this.score}`, this.width / 2, this.height / 2 + 20);
            this.ctx.font = '20px sans-serif';
            this.ctx.fillText('Press START to return to menu', this.width / 2, this.height / 2 + 60);
            this.ctx.textAlign = 'left';
        }
    }
}

window.gameConsole.registerGame('flappybird', FlappyBird);
