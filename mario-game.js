class MarioGame extends BaseGame {
    constructor(container) {
      super(container);
       
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.container.appendChild(this.canvas);
      this.canvas.width = this.width;
      this.canvas.height = this.height;
  
       
       
      this.levels = [
        {
          worldWidth: 2000,
          platforms: [
            { x: 0, y: this.height - 40, width: 2000, height: 40 },
            { x: 200, y: this.height - 120, width: 120, height: 10 },
            { x: 400, y: this.height - 180, width: 100, height: 10 },
            { x: 600, y: this.height - 150, width: 150, height: 10 },
            { x: 800, y: this.height - 220, width: 120, height: 10 },
            { x: 1000, y: this.height - 180, width: 100, height: 10 },
            { x: 1200, y: this.height - 140, width: 150, height: 10 },
            { x: 1400, y: this.height - 200, width: 100, height: 10 },
            { x: 1600, y: this.height - 160, width: 120, height: 10 },
            { x: 1800, y: this.height - 220, width: 150, height: 10 },
          ],
          coins: [
            { x: 250, y: this.height - 140, radius: 5 },
            { x: 450, y: this.height - 200, radius: 5 },
            { x: 650, y: this.height - 170, radius: 5 },
            { x: 850, y: this.height - 240, radius: 5 },
            { x: 1050, y: this.height - 200, radius: 5 },
            { x: 1250, y: this.height - 160, radius: 5 },
            { x: 1450, y: this.height - 220, radius: 5 },
            { x: 1650, y: this.height - 180, radius: 5 },
            { x: 1850, y: this.height - 240, radius: 5 },
          ],
          enemies: [
            { x: 500, y: this.height - 40 - 20, width: 20, height: 20, vx: -1 },
            { x: 1100, y: this.height - 40 - 20, width: 20, height: 20, vx: 1 },
            { x: 1500, y: this.height - 40 - 20, width: 20, height: 20, vx: -1 },
          ],
          flag: { x: 1900, y: this.height - 40 - 80, width: 10, height: 80 },
          startX: 50,
        },
        {
          worldWidth: 2500,
          platforms: [
            { x: 0, y: this.height - 40, width: 2500, height: 40 },
            { x: 150, y: this.height - 100, width: 100, height: 10 },
            { x: 350, y: this.height - 150, width: 120, height: 10 },
            { x: 600, y: this.height - 120, width: 150, height: 10 },
            { x: 900, y: this.height - 200, width: 100, height: 10 },
            { x: 1200, y: this.height - 170, width: 150, height: 10 },
            { x: 1500, y: this.height - 130, width: 120, height: 10 },
            { x: 1800, y: this.height - 180, width: 100, height: 10 },
            { x: 2100, y: this.height - 150, width: 120, height: 10 },
            { x: 2300, y: this.height - 200, width: 150, height: 10 },
          ],
          coins: [
            { x: 200, y: this.height - 120, radius: 5 },
            { x: 400, y: this.height - 170, radius: 5 },
            { x: 650, y: this.height - 140, radius: 5 },
            { x: 950, y: this.height - 220, radius: 5 },
            { x: 1250, y: this.height - 190, radius: 5 },
            { x: 1550, y: this.height - 150, radius: 5 },
            { x: 1850, y: this.height - 200, radius: 5 },
            { x: 2150, y: this.height - 170, radius: 5 },
            { x: 2350, y: this.height - 220, radius: 5 },
          ],
          enemies: [
            { x: 500, y: this.height - 40 - 20, width: 20, height: 20, vx: 1 },
            { x: 1300, y: this.height - 40 - 20, width: 20, height: 20, vx: -1 },
            { x: 1900, y: this.height - 40 - 20, width: 20, height: 20, vx: 1 },
          ],
          flag: { x: 2400, y: this.height - 40 - 80, width: 10, height: 80 },
          startX: 50,
        },
        {
          worldWidth: 2200,
          platforms: [
            { x: 0, y: this.height - 40, width: 2200, height: 40 },
            { x: 100, y: this.height - 110, width: 80, height: 10 },
            { x: 250, y: this.height - 160, width: 120, height: 10 },
            { x: 450, y: this.height - 130, width: 150, height: 10 },
            { x: 700, y: this.height - 200, width: 100, height: 10 },
            { x: 900, y: this.height - 150, width: 120, height: 10 },
            { x: 1100, y: this.height - 180, width: 150, height: 10 },
            { x: 1400, y: this.height - 140, width: 120, height: 10 },
            { x: 1600, y: this.height - 170, width: 100, height: 10 },
            { x: 1800, y: this.height - 200, width: 120, height: 10 },
          ],
          coins: [
            { x: 150, y: this.height - 90, radius: 5 },
            { x: 300, y: this.height - 140, radius: 5 },
            { x: 500, y: this.height - 110, radius: 5 },
            { x: 750, y: this.height - 180, radius: 5 },
            { x: 950, y: this.height - 130, radius: 5 },
            { x: 1150, y: this.height - 160, radius: 5 },
            { x: 1450, y: this.height - 120, radius: 5 },
            { x: 1650, y: this.height - 150, radius: 5 },
            { x: 1850, y: this.height - 180, radius: 5 },
          ],
          enemies: [
            { x: 400, y: this.height - 40 - 20, width: 20, height: 20, vx: -1 },
            { x: 1000, y: this.height - 40 - 20, width: 20, height: 20, vx: 1 },
            { x: 1700, y: this.height - 40 - 20, width: 20, height: 20, vx: -1 },
          ],
          flag: { x: 2100, y: this.height - 40 - 80, width: 10, height: 80 },
          startX: 50,
        },
        {
          worldWidth: 2600,
          platforms: [
            { x: 0, y: this.height - 40, width: 2600, height: 40 },
            { x: 100, y: this.height - 100, width: 80, height: 10 },
            { x: 250, y: this.height - 150, width: 100, height: 10 },
            { x: 400, y: this.height - 120, width: 150, height: 10 },
            { x: 700, y: this.height - 200, width: 120, height: 10 },
            { x: 950, y: this.height - 160, width: 100, height: 10 },
            { x: 1200, y: this.height - 180, width: 150, height: 10 },
            { x: 1500, y: this.height - 140, width: 120, height: 10 },
            { x: 1800, y: this.height - 170, width: 100, height: 10 },
            { x: 2100, y: this.height - 200, width: 120, height: 10 },
          ],
          coins: [
            { x: 150, y: this.height - 80, radius: 5 },
            { x: 300, y: this.height - 130, radius: 5 },
            { x: 500, y: this.height - 100, radius: 5 },
            { x: 750, y: this.height - 180, radius: 5 },
            { x: 1000, y: this.height - 140, radius: 5 },
            { x: 1250, y: this.height - 160, radius: 5 },
            { x: 1550, y: this.height - 120, radius: 5 },
            { x: 1850, y: this.height - 150, radius: 5 },
            { x: 2150, y: this.height - 180, radius: 5 },
          ],
          enemies: [
            { x: 500, y: this.height - 40 - 20, width: 20, height: 20, vx: 1 },
            { x: 1300, y: this.height - 40 - 20, width: 20, height: 20, vx: -1 },
            { x: 1900, y: this.height - 40 - 20, width: 20, height: 20, vx: 1 },
          ],
          flag: { x: 2500, y: this.height - 40 - 80, width: 10, height: 80 },
          startX: 50,
        },
        {
          worldWidth: 2400,
          platforms: [
            { x: 0, y: this.height - 40, width: 2400, height: 40 },
            { x: 150, y: this.height - 110, width: 100, height: 10 },
            { x: 350, y: this.height - 160, width: 120, height: 10 },
            { x: 550, y: this.height - 130, width: 150, height: 10 },
            { x: 800, y: this.height - 200, width: 100, height: 10 },
            { x: 1050, y: this.height - 150, width: 120, height: 10 },
            { x: 1300, y: this.height - 180, width: 150, height: 10 },
            { x: 1600, y: this.height - 140, width: 120, height: 10 },
            { x: 1800, y: this.height - 170, width: 100, height: 10 },
            { x: 2100, y: this.height - 200, width: 120, height: 10 },
          ],
          coins: [
            { x: 200, y: this.height - 90, radius: 5 },
            { x: 400, y: this.height - 140, radius: 5 },
            { x: 600, y: this.height - 110, radius: 5 },
            { x: 850, y: this.height - 180, radius: 5 },
            { x: 1100, y: this.height - 130, radius: 5 },
            { x: 1350, y: this.height - 160, radius: 5 },
            { x: 1650, y: this.height - 120, radius: 5 },
            { x: 1900, y: this.height - 150, radius: 5 },
            { x: 2150, y: this.height - 180, radius: 5 },
          ],
          enemies: [
            { x: 600, y: this.height - 40 - 20, width: 20, height: 20, vx: -1.5 },
            { x: 1400, y: this.height - 40 - 20, width: 20, height: 20, vx: 1.5 },
            { x: 2000, y: this.height - 40 - 20, width: 20, height: 20, vx: -1.5 },
          ],
          flag: { x: 2300, y: this.height - 40 - 80, width: 10, height: 80 },
          startX: 50,
        },
        {
          worldWidth: 2200,
          platforms: [
            { x: 0, y: this.height - 40, width: 2200, height: 40 },
            { x: 300, y: this.height - 120, width: 100, height: 10 },
            { x: 600, y: this.height - 180, width: 120, height: 10 },
            { x: 900, y: this.height - 150, width: 150, height: 10 },
            { x: 1200, y: this.height - 220, width: 100, height: 10 },
            { x: 1500, y: this.height - 180, width: 120, height: 10 },
            { x: 1800, y: this.height - 140, width: 150, height: 10 },
          ],
          coins: [
            { x: 350, y: this.height - 100, radius: 5 },
            { x: 650, y: this.height - 160, radius: 5 },
            { x: 950, y: this.height - 130, radius: 5 },
            { x: 1250, y: this.height - 190, radius: 5 },
            { x: 1550, y: this.height - 150, radius: 5 },
            { x: 1850, y: this.height - 110, radius: 5 },
          ],
          enemies: [
            { x: 500, y: this.height - 40 - 20, width: 20, height: 20, vx: 1 },
            { x: 1100, y: this.height - 40 - 20, width: 20, height: 20, vx: -1 },
            { x: 1700, y: this.height - 40 - 20, width: 20, height: 20, vx: 1 },
          ],
          flag: { x: 2100, y: this.height - 40 - 80, width: 10, height: 80 },
          startX: 50,
        },
        {
          worldWidth: 2400,
          platforms: [
            { x: 0, y: this.height - 40, width: 2400, height: 40 },
            { x: 200, y: this.height - 100, width: 80, height: 10 },
            { x: 350, y: this.height - 150, width: 100, height: 10 },
            { x: 500, y: this.height - 120, width: 150, height: 10 },
            { x: 750, y: this.height - 200, width: 120, height: 10 },
            { x: 1000, y: this.height - 160, width: 100, height: 10 },
            { x: 1250, y: this.height - 180, width: 150, height: 10 },
            { x: 1500, y: this.height - 140, width: 120, height: 10 },
            { x: 1750, y: this.height - 170, width: 100, height: 10 },
            { x: 2000, y: this.height - 200, width: 120, height: 10 },
          ],
          coins: [
            { x: 250, y: this.height - 80, radius: 5 },
            { x: 450, y: this.height - 130, radius: 5 },
            { x: 650, y: this.height - 100, radius: 5 },
            { x: 850, y: this.height - 180, radius: 5 },
            { x: 1100, y: this.height - 140, radius: 5 },
            { x: 1350, y: this.height - 160, radius: 5 },
            { x: 1600, y: this.height - 120, radius: 5 },
            { x: 1850, y: this.height - 150, radius: 5 },
            { x: 2050, y: this.height - 180, radius: 5 },
          ],
          enemies: [
            { x: 600, y: this.height - 40 - 20, width: 20, height: 20, vx: -2 },
            { x: 1400, y: this.height - 40 - 20, width: 20, height: 20, vx: 2 },
            { x: 1800, y: this.height - 40 - 20, width: 20, height: 20, vx: -2 },
          ],
          flag: { x: 2300, y: this.height - 40 - 80, width: 10, height: 80 },
          startX: 50,
        },
      ];
      this.totalLevels = this.levels.length;
      this.currentLevel = 0;
  
       
      this.gravity = 0.6;
      this.jumpStrength = -12;
      this.moveSpeed = 3;
  
      this.reset();
    }
  
    reset() {
       
      this.state = 'menu';  
      this.win = false;
      this.score = 0;
      this.coinsCollected = 0;
      this.currentLevel = 0;
      this.loadLevel(this.currentLevel);
      if (this.gameLoop) clearInterval(this.gameLoop);
    }
  
    loadLevel(index) {
       
      let level = this.levels[index];
      this.worldWidth = level.worldWidth;
       
      this.platforms = level.platforms;
      this.coins = level.coins.map(c => ({ ...c, collected: false }));
      this.enemies = level.enemies.map(e => ({ ...e, defeated: false }));
      this.flag = level.flag;
       
      this.mario = {
        x: level.startX || 50,
        y: this.platforms[0].y - 30,  
        width: 20,
        height: 30,
        vx: 0,
        vy: 0,
        isOnGround: false,
      };
       
      this.cameraX = 0;
    }
  
    start() {
       
      this.reset();
      this.state = 'menu';
      this.draw();
    }
  
    startGame() {
      if (this.state === 'playing') return;
       
      if (this.state === 'levelcomplete') {
         
        return;
      }
      this.state = 'playing';
      this.gameLoop = setInterval(() => {
        this.update();
        this.draw();
      }, 16);
    }
  
    update() {
      if (this.state !== 'playing') return;
  
       
      if (this.keys && this.keys.left && !this.keys.right) {
        this.mario.vx = -this.moveSpeed;
      } else if (this.keys && this.keys.right && !this.keys.left) {
        this.mario.vx = this.moveSpeed;
      } else {
        this.mario.vx = 0;
      }
      this.mario.vy += this.gravity;
      this.mario.x += this.mario.vx;
      this.mario.y += this.mario.vy;
  
       
      if (this.mario.x < 0) this.mario.x = 0;
      if (this.mario.x + this.mario.width > this.worldWidth)
        this.mario.x = this.worldWidth - this.mario.width;
  
       
      this.mario.isOnGround = false;
      for (let plat of this.platforms) {
        if (
          this.mario.vy >= 0 &&
          this.mario.x + this.mario.width > plat.x &&
          this.mario.x < plat.x + plat.width &&
          this.mario.y + this.mario.height > plat.y &&
          this.mario.y + this.mario.height - this.mario.vy <= plat.y
        ) {
          this.mario.y = plat.y - this.mario.height;
          this.mario.vy = 0;
          this.mario.isOnGround = true;
        }
      }
  
       
      for (let coin of this.coins) {
        if (!coin.collected && this.rectCircleCollide(this.mario, coin)) {
          coin.collected = true;
          this.score += 10;
          this.coinsCollected++;
        }
      }
  
       
      for (let enemy of this.enemies) {
        if (enemy.defeated) continue;
        enemy.x += enemy.vx;
         
        let ground = this.platforms[0];
        if (enemy.x < ground.x || enemy.x + enemy.width > ground.x + ground.width) {
          enemy.vx *= -1;
        }
        if (this.rectsCollide(this.mario, enemy)) {
           
          if (this.mario.vy > 0 && (this.mario.y + this.mario.height - enemy.y) < 10) {
            enemy.defeated = true;
            this.mario.vy = this.jumpStrength / 2;
            this.score += 20;
          } else {
            this.state = 'gameover';
            clearInterval(this.gameLoop);
            return;
          }
        }
      }
  
       
      if (this.rectsCollide(this.mario, this.flag)) {
        clearInterval(this.gameLoop);
        if (this.currentLevel < this.totalLevels - 1) {
          this.state = 'levelcomplete';
        } else {
          this.win = true;
          this.state = 'gameover';
        }
        return;
      }
  
       
      if (this.mario.y > this.height) {
        this.state = 'gameover';
        clearInterval(this.gameLoop);
        return;
      }
  
       
      this.cameraX = this.mario.x - this.width / 2;
      if (this.cameraX < 0) this.cameraX = 0;
      if (this.cameraX > this.worldWidth - this.width)
        this.cameraX = this.worldWidth - this.width;
    }
  
     
    rectsCollide(r1, r2) {
      return !(
        r1.x + r1.width < r2.x ||
        r1.x > r2.x + r2.width ||
        r1.y + r1.height < r2.y ||
        r1.y > r2.y + r2.height
      );
    }
  
    rectCircleCollide(rect, circle) {
      let cx = circle.x, cy = circle.y;
      let closestX = Math.max(rect.x, Math.min(cx, rect.x + rect.width));
      let closestY = Math.max(rect.y, Math.min(cy, rect.y + rect.height));
      let dx = cx - closestX, dy = cy - closestY;
      return dx * dx + dy * dy < circle.radius * circle.radius;
    }
  
    handleInput(button, isPressed) {
       
      if (!this.keys) this.keys = { left: false, right: false };
      if (!isPressed) {
        if (button === 'left' || button === 'right') {
          this.keys[button] = false;
        }
        return;
      }
      
      if (this.state === 'menu') {
        if (button === 'start' || button === 'select') {
          this.startGame();
        }
      } else if (this.state === 'playing') {
        if (button === 'left' || button === 'right') {
          this.keys[button] = true;
        }
        if (button.toLowerCase() === 'a' && this.mario.isOnGround) {
          this.mario.vy = this.jumpStrength;
          this.mario.isOnGround = false;
        }
      } else if (this.state === 'levelcomplete') {
         
        if (button === 'start' || button === 'select') {
          this.currentLevel++;
          this.loadLevel(this.currentLevel);
          this.state = 'playing';
          this.gameLoop = setInterval(() => {
            this.update();
            this.draw();
          }, 16);
        }
      } else if (this.state === 'gameover') {
        if (button === 'start') {
          this.reset();
        }
      }
    }
  
    draw() {
       
      this.ctx.clearRect(0, 0, this.width, this.height);
  
       
      let grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
      grad.addColorStop(0, '#87CEEB');
      grad.addColorStop(1, '#fff');
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, 0, this.width, this.height);
  
       
      this.ctx.save();
      this.ctx.translate(-this.cameraX, 0);
  
       
      this.ctx.fillStyle = '#8B4513';
      for (let plat of this.platforms) {
        this.ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
      }
  
       
      for (let coin of this.coins) {
        if (!coin.collected) {
          this.ctx.fillStyle = '#FFD700';
          this.ctx.beginPath();
          this.ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }
  
       
      for (let enemy of this.enemies) {
        if (!enemy.defeated) {
          this.ctx.fillStyle = '#654321';
          this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        }
      }
  
       
      this.ctx.fillStyle = '#000';
      this.ctx.fillRect(this.flag.x, this.flag.y, 4, this.flag.height);
      this.ctx.fillStyle = '#f00';
      this.ctx.fillRect(this.flag.x + 4, this.flag.y, 20, 12);
  
       
      this.ctx.fillStyle = '#f00';
      this.ctx.fillRect(this.mario.x, this.mario.y, this.mario.width, this.mario.height);
  
      this.ctx.restore();
  
       
      this.ctx.fillStyle = '#000';
      this.ctx.font = '16px sans-serif';
      this.ctx.fillText(`Score: ${this.score}`, 10, 20);
      this.ctx.fillText(`Coins: ${this.coinsCollected}`, 10, 40);
      this.ctx.fillText(`Level: ${this.currentLevel + 1} / ${this.totalLevels}`, 10, 60);
  
       
      this.ctx.textAlign = 'center';
      if (this.state === 'menu') {
        this.ctx.fillStyle = '#000';
        this.ctx.font = '28px sans-serif';
        this.ctx.fillText('MARIO GAME', this.width / 2, this.height / 3);
        this.ctx.font = '20px sans-serif';
        this.ctx.fillText('Press START to play', this.width / 2, this.height / 2);
      }
      if (this.state === 'levelcomplete') {
        this.ctx.fillStyle = '#000';
        this.ctx.font = '28px sans-serif';
        this.ctx.fillText(`Level ${this.currentLevel} Complete!`, this.width / 2, this.height / 3);
        this.ctx.font = '20px sans-serif';
        this.ctx.fillText('Press START for next level', this.width / 2, this.height / 2);
      }
      if (this.state === 'gameover') {
        this.ctx.fillStyle = '#000';
        this.ctx.font = '28px sans-serif';
        if (this.win) {
          this.ctx.fillText('You Win!', this.width / 2, this.height / 3);
        } else {
          this.ctx.fillText('Game Over', this.width / 2, this.height / 3);
        }
        this.ctx.font = '20px sans-serif';
        this.ctx.fillText('Press START to return to menu', this.width / 2, this.height / 2);
      }
      this.ctx.textAlign = 'left';
    }
  }
  
  window.gameConsole.registerGame('mario', MarioGame);
  