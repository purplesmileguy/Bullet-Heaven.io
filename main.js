import Boss from './boss.js';   
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = 800;
        this.height = 600;
        
        this.player = new Player(400, 500);
        this.boss = new Boss(400, 100);
        this.projectiles = [];
        this.particles = [];
        this.mouseX = 400;
        this.mouseY = 300;
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });
        
        this.keys = {};
        this.gameState = 'playing'; // playing, gameOver, victory
        this.warningEl = document.getElementById('warning');
        this.phaseEl = document.getElementById('phaseIndicator');
        
        this.setupEventListeners();
        this.gameLoop();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }
    
    update() {
        if (this.gameState !== 'playing') return;
        
        this.player.update(this.keys);
        this.boss.update();
        
        // Обновляем снаряды
        this.projectiles = this.projectiles.filter(p => {
            p.update();
            return p.isActive();
        });
        
        // Обновляем частицы
        this.particles = this.particles.filter(p => {
            p.update();
            return p.life > 0;
        });
        
        // Проверяем столкновения
        this.checkCollisions();
        
        // Обновляем HUD
        this.updateHUD();
        
        // Проверяем условия окончания игры
        if (this.player.hp <= 0) {
            this.gameState = 'gameOver';
            this.showWarning('Lose! F5 for restart');
        }
        
        if (this.boss.hp <= 0) {
            this.gameState = 'victory';
            this.showWarning('Victory!');
        }
    }
    
    checkCollisions() {
        // Столкновения снарядов босса с игроком
        this.projectiles.forEach(p => {
            if (p.isEnemyProjectile && this.player.collidesWith(p)) {
                if (!this.player.isDodging) {
                    this.player.takeDamage();
                    this.createParticles(this.player.x, this.player.y, '#ff0066', 10);
                }
                p.destroy();
            }
        });
        
        // Столкновения снарядов игрока с боссом
        this.projectiles.forEach(p => {
            if (!p.isEnemyProjectile && this.boss.collidesWith(p)) {
                if (this.boss.isVulnerable) {
                    this.boss.takeDamage();
                    this.createParticles(this.boss.x, this.boss.y, '#00ff00', 15);
                }
                p.destroy();
            }
        });
    }
    
    createParticles(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(x, y, color));
        }
    }
    
    addProjectile(projectile) {
        this.projectiles.push(projectile);
    }
    
    showWarning(text) {
        this.warningEl.textContent = text;
        this.warningEl.style.display = 'block';
    }
    
    showPhaseIndicator(text) {
        this.phaseEl.textContent = text;
        this.phaseEl.style.display = 'block';
        setTimeout(() => {
            this.phaseEl.style.display = 'none';
        }, 2000);
    }
    
    updateHUD() {
        document.getElementById('playerHp').textContent = this.player.hp;
        document.getElementById('playerStamina').textContent = this.player.stamina;
        document.getElementById('bossPhase').textContent = this.boss.phase;
        document.getElementById('bossHp').textContent = this.boss.hp;
    }
    
    render() {
        
        // Очистка канваса
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Рендер частиц
        this.particles.forEach(p => p.render(this.ctx));
        
        // Рендер снарядов
        this.projectiles.forEach(p => p.render(this.ctx));
        
        // Рендер игрока и босса
        this.player.render(this.ctx);
        this.boss.render(this.ctx);
    }
    
    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 16;
        this.height = 16;
        this.speed = 4;
        this.hp = 5;
        this.stamina = 3;
        this.maxStamina = 3;
        this.isDodging = false;
        this.dodgeCooldown = 0;
        this.attackCooldown = 0;
        this.staminaRegenTimer = 0;
    }
    
    update(keys) {
        // Движение
        if (keys['KeyW'] || keys['ArrowUp']) this.y -= this.speed;
        if (keys['KeyS'] || keys['ArrowDown']) this.y += this.speed;
        if (keys['KeyA'] || keys['ArrowLeft']) this.x -= this.speed;
        if (keys['KeyD'] || keys['ArrowRight']) this.x += this.speed;
        
        // Ограничения экрана
        this.x = Math.max(8, Math.min(792, this.x));
        this.y = Math.max(8, Math.min(592, this.y));
        
        // Уклонение
        if (keys['ShiftLeft'] && this.stamina > 0 && this.dodgeCooldown <= 0) {
            this.isDodging = true;
            this.stamina--;
            this.dodgeCooldown = 60; // 1 секунда при 60 FPS
            this.staminaRegenTimer = 180; // 3 секунды до восстановления
        }
        
        if (this.dodgeCooldown > 0) {
            this.dodgeCooldown--;
            if (this.dodgeCooldown <= 0) {
                this.isDodging = false;
            }
        }
        
        // Восстановление стамины
        if (this.staminaRegenTimer > 0) {
            this.staminaRegenTimer--;
        } else if (this.stamina < this.maxStamina) {
            this.stamina++;
            this.staminaRegenTimer = 120; // 2 секунды между восстановлениями
        }
        
        // Атака
        if (keys['Space'] && this.attackCooldown <= 0) {
            this.attack();
            this.attackCooldown = 30;
        }
        
        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        }
    }
    
    attack() {
        let dx = game.mouseX - this.x;
        let dy = game.mouseY - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        let vx = (dx / dist) * 8;
        let vy = (dy / dist) * 8;
        game.addProjectile(new Projectile(this.x, this.y, vx, vy, false));
        game.createParticles(this.x, this.y, '#ffff00', 6)
        
    }
    
    collidesWith(obj) {
        return this.x < obj.x + obj.width &&
               this.x + this.width > obj.x &&
               this.y < obj.y + obj.height &&
               this.y + this.height > obj.y;
    }
    
    takeDamage() {
        this.hp--;
    }
    
    render(ctx) {
        // Эффект уклонения
        if (this.isDodging) {
            ctx.globalAlpha = 0.3;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#00ffff';
        }
        
        ctx.fillStyle = this.isDodging ? '#00ffff' : '#00ff00';
        ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
        
        // Индикатор стамины
        for (let i = 0; i < this.maxStamina; i++) {
            ctx.fillStyle = i < this.stamina ? '#ffff00' : '#333';
            ctx.fillRect(this.x - 20 + i * 8, this.y - 25, 6, 4);
        }
        
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    }
}

class Projectile {
    constructor(x, y, vx, vy, isEnemy = false, life = 300) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.width = isEnemy ? 8 : 4;
        this.height = isEnemy ? 8 : 4;
        this.isEnemyProjectile = isEnemy;
        this.active = true;
        this.life = life;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        
        if (this.life <= 0 || this.x < -50 || this.x > 850 || this.y < -50 || this.y > 650) {
            this.active = false;
        }
    }
    
    isActive() {
        return this.active;
    }
    
    destroy() {
        this.active = false;
    }
    
    render(ctx) {
        ctx.fillStyle = this.isEnemyProjectile ? '#ff0066' : '#00ffff';
        ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
        
        if (this.isEnemyProjectile) {
            ctx.shadowBlur = 5;
            ctx.shadowColor = '#ff0066';
        } else {
            ctx.shadowBlur = 3;
            ctx.shadowColor = '#00ffff';
        }
        ctx.shadowBlur = 0;
    }
}

// 🔥 СПЕЦИАЛЬНЫЕ ТИПЫ СНАРЯДОВ 🔥

class GravityProjectile extends Projectile {
    constructor(x, y, vx, vy, centerX, centerY) {
        super(x, y, vx, vy, true);
        this.centerX = centerX;
        this.centerY = centerY;
        this.exploded = false;
    }
    
    update() {
        super.update();
        
        // Проверяем достижение центра
        let distToCenter = Math.sqrt((this.x - this.centerX)**2 + (this.y - this.centerY)**2);
        if (distToCenter < 20 && !this.exploded) {
            this.explode();
            this.exploded = true;
        }
    }
    
    explode() {
        // Взрыв в центре
        for (let i = 0; i < 12; i++) {
            let angle = (i * 30) * Math.PI / 180;
            let vx = Math.cos(angle) * 5;
            let vy = Math.sin(angle) * 5;
            game.addProjectile(new Projectile(this.centerX, this.centerY, vx, vy, true));
        }
        this.destroy();
    }
}

class BouncingProjectile extends Projectile {
    constructor(x, y, vx, vy) {
        super(x, y, vx, vy, true);
        this.bounces = 3;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        
        // Отскоки от стен
        if (this.x <= 0 || this.x >= 800) {
            this.vx = -this.vx;
            this.bounces--;
        }
        if (this.y <= 0 || this.y >= 600) {
            this.vy = -this.vy;
            this.bounces--;
        }
        
        if (this.bounces <= 0 || this.life <= 0) {
            this.active = false;
        }
    }
    
    render(ctx) {
        ctx.fillStyle = '#ff6600';
        ctx.fillRect(this.x - 6, this.y - 6, 12, 12);
        ctx.shadowBlur = 7;
        ctx.shadowColor = '#ff6600';
        ctx.shadowBlur = 0;
    }
}

class DelayedBomb extends Projectile {
    constructor(x, y) {
        super(x, y, 0, 0, true, 180); // 3 секунды до взрыва
        this.blinkTimer = 0;
        this.exploded = false;
    }
    
    update() {
        this.life--;
        this.blinkTimer++;
        
        if (this.life <= 0 && !this.exploded) {
            this.explode();
            this.exploded = true;
        }
    }
    
    explode() {
        for (let i = 0; i < 8; i++) {
            let angle = (i * 45) * Math.PI / 180;
            let vx = Math.cos(angle) * 4;
            let vy = Math.sin(angle) * 4;
            game.addProjectile(new Projectile(this.x, this.y, vx, vy, true));
        }
        game.createParticles(this.x, this.y, '#ff6600', 20);
        this.destroy();
    }
    
    render(ctx) {
        // Мигающая бомба
        if (this.blinkTimer % 20 < 10) {
            ctx.fillStyle = '#ff0000';
        } else {
            ctx.fillStyle = '#ffff00';
        }
        ctx.fillRect(this.x - 10, this.y - 10, 20, 20);
        
        // Индикатор времени
        let timeLeft = this.life / 180;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x - 8, this.y - 12, 16 * timeLeft, 2);
    }
}

class FragmentProjectile extends Projectile {
    constructor(x, y, vx, vy) {
        super(x, y, vx, vy, true, 120);
        this.fragmented = false;
    }
    
    update() {
        super.update();
        
        if (this.life <= 60 && !this.fragmented) {
            this.fragment();
            this.fragmented = true;
        }
    }
    
    fragment() {
        // Разлетается на осколки
        for (let i = 0; i < 6; i++) {
            let angle = (i * 60) * Math.PI / 180;
            let vx = Math.cos(angle) * 3;
            let vy = Math.sin(angle) * 3;
            game.addProjectile(new Projectile(this.x, this.y, vx, vy, true, 120));
        }
        this.destroy();
    }
    
    render(ctx) {
        ctx.fillStyle = '#ff9900';
        ctx.fillRect(this.x - 8, this.y - 8, 16, 16);
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ff9900';
        ctx.shadowBlur = 0;
    }
}

class MeteorProjectile extends Projectile {
    constructor(x, y, vx, vy) {
        super(x, y, vx, vy, true);
        this.trailParticles = [];
        this.size = 6 + Math.random() * 8;
    }
    
    update() {
        super.update();
        
        // Создаем след
        if (Math.random() < 0.7) {
            this.trailParticles.push({
                x: this.x + (Math.random() - 0.5) * 10,
                y: this.y + (Math.random() - 0.5) * 10,
                life: 20,
                maxLife: 20
            });
        }
        
        // Обновляем частицы следа
        this.trailParticles = this.trailParticles.filter(p => {
            p.life--;
            return p.life > 0;
        });
    }
    
    render(ctx) {
        // Рендер следа
        this.trailParticles.forEach(p => {
            let alpha = p.life / p.maxLife;
            ctx.globalAlpha = alpha * 0.6;
            ctx.fillStyle = '#ffaa00';
            ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
        });
        ctx.globalAlpha = 1;
        
        // Рендер метеорита
        ctx.fillStyle = '#ff4400';
        ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff4400';
        ctx.shadowBlur = 0;
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
        this.life = 30;
        this.maxLife = 30;
        this.color = color;
        this.size = Math.random() * 4 + 2;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.life--;
    }
    
    render(ctx) {
        let alpha = this.life / this.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
        ctx.globalAlpha = 1;
    }
}
// Запуск игры
let game = new Game();
let musicPlayer = new MusicPlayer(); // Add this line
