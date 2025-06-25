class Boss {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 80;
        this.hp = 50;
        this.maxHp = 50;
        this.phase = 1;
        this.attackTimer = 0;
        this.attackPattern = 0;
        this.isVulnerable = false;
        this.vulnerabilityTimer = 0;
        this.chargeTimer = 0;
        this.isCharging = false;
        this.phaseTransitionTimer = 0;
    }
    
    update() {
        this.attackTimer++;
        
        // Переход между фазами
        if (this.hp <= 40 && this.phase === 1) {
            this.phase = 2;
            game.showPhaseIndicator('PHASE 2: RAGE!');
            this.phaseTransitionTimer = 120;
        }
        
        if (this.hp <= 20 && this.phase === 2) {
            this.phase = 3;
            game.showPhaseIndicator('PHASE 3: LUDICRIOUS!');
            this.phaseTransitionTimer = 120;
        }
        
        if (this.phaseTransitionTimer > 0) {
            this.phaseTransitionTimer--;
            return;
        }
        
        // Окно уязвимости
        if (this.vulnerabilityTimer > 0) {
            this.vulnerabilityTimer--;
            this.isVulnerable = this.vulnerabilityTimer > 0;
        }
        
        // Зарядка атаки
        if (this.isCharging) {
            this.chargeTimer--;
            if (this.chargeTimer <= 0) {
                this.executeAttack();
                this.isCharging = false;
                this.vulnerabilityTimer = 60; // 1 секунда уязвимости
            }
            return;
        }
        
        // Паттерны атак в зависимости от фазы
        let attackInterval = this.getAttackInterval();
        
        if (this.attackTimer >= attackInterval) {
            this.startAttack();
            this.attackTimer = 0;
        }
    }
    
    getAttackInterval() {
        switch (this.phase) {
            case 1: return 120; // 2 секунды
            case 2: return 90;  // 1.5 секунды
            case 3: return 60;  // 1 секунда
        }
    }
    
    startAttack() {
        this.isCharging = true;
        this.chargeTimer = 60; // 1 секунда зарядки
        
        // Выбор паттерна атаки
        switch (this.phase) {
            case 1:
                this.attackPattern = Math.floor(Math.random() * 8);
                break;
            case 2:
                this.attackPattern = Math.floor(Math.random() * 15);
                break;
            case 3:
                this.attackPattern = Math.floor(Math.random() * 23);
                break;
        }
    }
    
    executeAttack() {
        switch (this.attackPattern) {
            case 0:
                this.laserSweep();
                break;
            case 1:
                this.pulseNova();
                break;
            case 2:
                this.spreadShot();
                break;
            case 3:
                this.spiralAttack();
                break;
            case 4:
                this.rapidFire();
                break;
            case 5:
                this.crossPattern();
                break;
            case 6:
                this.chaosStorm();
                break;
            case 7:
                this.zigzagLasers();
                break;
            case 8:
                this.orbitingShields();
                break;
            case 9:
                this.teleportStrike();
                break;
            case 10:
                this.mirrorAttack();
                break;
            case 11:
                this.gravitationalPull();
                break;
            case 12:
                this.bounceShots();
                break;
            case 13:
                this.timeDelayBombs();
                break;
            case 14:
                this.phantomClones();
                break;
            case 15:
                this.sineWaveAttack();
                break;
            case 16:
                this.vortexTrap();
                break;
            case 17:
                this.railgunSnipe();
                break;
            case 18:
                this.fragmentationBurst();
                break;
            case 19:
                this.shadowStep();
                break;
            case 20:
                this.energyBarrier();
                break;
            case 21:
                this.meteorShower();
                break;
            case 22:
                this.fallingMeteorites();
                break;
            case 23:
                this.tornadoAttack();
                break;
        }
    }
    
    laserSweep() {
        // Горизонтальный лазер
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                game.addProjectile(new Projectile(i * 40, this.y + 50, 0, 4, true));
            }, i * 50);
        }
    }
    
    pulseNova() {
        // Волны по кругу
        for (let wave = 0; wave < 3; wave++) {
            setTimeout(() => {
                for (let i = 0; i < 12; i++) {
                    let angle = (i * 30) * Math.PI / 180;
                    let vx = Math.cos(angle) * 3;
                    let vy = Math.sin(angle) * 3;
                    game.addProjectile(new Projectile(this.x, this.y, vx, vy, true));
                }
            }, wave * 300);
        }
    }
    
    spreadShot() {
        // Веер снарядов
        for (let i = -4; i <= 4; i++) {
            let angle = i * 15 * Math.PI / 180;
            let vx = Math.sin(angle) * 5;
            let vy = Math.cos(angle) * 5;
            game.addProjectile(new Projectile(this.x, this.y, vx, vy, true));
        }
    }
    
    spiralAttack() {
        // Спиральная атака
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                let angle = (i * 12) * Math.PI / 180;
                let vx = Math.cos(angle) * 4;
                let vy = Math.sin(angle) * 4;
                game.addProjectile(new Projectile(this.x, this.y, vx, vy, true));
            }, i * 100);
        }
    }
    
    rapidFire() {
        // Быстрая стрельба по игроку
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                let dx = game.player.x - this.x;
                let dy = game.player.y - this.y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                let vx = (dx / dist) * 6;
                let vy = (dy / dist) * 6;
                game.addProjectile(new Projectile(this.x, this.y, vx, vy, true));
            }, i * 150);
        }
    }
    tornadoAttack() {
        let numProjectiles = 12; // Количество снарядов
        let radius = 40; // Радиус спирали
        let angleOffset = Math.random() * Math.PI * 2; // Случайный сдвиг угла для разнообразия
    
        for (let i = 0; i < numProjectiles; i++) {
            let angle = (i * (Math.PI * 2) / numProjectiles) + angleOffset; // Распределение углов снарядов
            let speed = 3 + Math.random() * 2; // Случайная скорость
    
            let vx = Math.cos(angle) * speed;
            let vy = Math.sin(angle) * speed;
    
            // Каждое снаряд начинает движение по спирали
            setInterval(() => {
                vx += Math.cos(angle) * 0.1; // Увеличение скорости по кругу
                vy += Math.sin(angle) * 0.1;
            }, 50);
    
            // Создаем снаряд и добавляем его
            game.addProjectile(new Projectile(this.x, this.y, vx, vy, true));
        }
    }
    
    fallingMeteorites() {
        let numMeteors = 8; // Количество метеоритов
    
        for (let i = 0; i < numMeteors; i++) {
            let x = Math.random() * game.width; // Случайная позиция по оси X
            let speed = 5 + Math.random() * 3; // Случайная скорость падения
            let angle = Math.random() * Math.PI / 4 - Math.PI / 8; // Случайный угол отклонения
    
            let vx = Math.sin(angle) * speed;
            let vy = Math.cos(angle) * speed;
    
            // Создаем метеорит
            setInterval(() => {
                vx += (Math.random() - 0.5) * 0.5; // Легкое изменение направления
                vy += 0.2; // Падение вниз
    
                if (vy > 7) vy = 7; // Ограничиваем падение метеорита
            }, 50);
    
            game.addProjectile(new Projectile(x, -20, vx, vy, true)); // Начальная позиция метеорита сверху
        }
    }
    
    crossPattern() {
        // Крестообразная атака
        let directions = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [-1, -1], [1, -1], [-1, 1]];
        directions.forEach(([dx, dy]) => {
            for (let i = 1; i <= 5; i++) {
                setTimeout(() => {
                    game.addProjectile(new Projectile(this.x, this.y, dx * 4, dy * 4, true));
                }, i * 200);
            }
        });
    }
    
    chaosStorm() {
        // Хаотичная атака
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                let angle = Math.random() * Math.PI * 2;
                let speed = 3 + Math.random() * 4;
                let vx = Math.cos(angle) * speed;
                let vy = Math.sin(angle) * speed;
                game.addProjectile(new Projectile(this.x, this.y, vx, vy, true));
            }, Math.random() * 1000);
        }
    }
    
    // 🔥 НОВЫЕ УНИКАЛЬНЫЕ ПАТТЕРНЫ АТАК 🔥
    
    zigzagLasers() {
        // Зигзагообразные лазеры
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                let direction = i % 2 === 0 ? 1 : -1;
                for (let j = 0; j < 10; j++) {
                    setTimeout(() => {
                        let x = 50 + j * 70;
                        let y = 200 + Math.sin(j * 0.5) * 100 * direction;
                        game.addProjectile(new Projectile(x, y, 0, 5, true));
                    }, j * 50);
                }
            }, i * 200);
        }
    }
    
    orbitingShields() {
        // Вращающиеся щиты-снаряды
        for (let orbit = 0; orbit < 3; orbit++) {
            for (let i = 0; i < 8; i++) {
                setTimeout(() => {
                    let radius = 80 + orbit * 40;
                    let angle = (i * 45 + Date.now() * 0.01) * Math.PI / 180;
                    let x = this.x + Math.cos(angle) * radius;
                    let y = this.y + Math.sin(angle) * radius;
                    let vx = Math.cos(angle + Math.PI/2) * 2;
                    let vy = Math.sin(angle + Math.PI/2) * 2;
                    game.addProjectile(new Projectile(x, y, vx, vy, true));
                }, orbit * 500 + i * 100);
            }
        }
    }
    
    teleportStrike() {
        // Телепорт с мгновенной атакой
        let originalX = this.x;
        let originalY = this.y;
        
        // Телепорт к игроку
        this.x = game.player.x;
        this.y = game.player.y - 100;
        
        // Мгновенная атака
        for (let i = 0; i < 12; i++) {
            let angle = (i * 30) * Math.PI / 180;
            let vx = Math.cos(angle) * 6;
            let vy = Math.sin(angle) * 6;
            game.addProjectile(new Projectile(this.x, this.y, vx, vy, true));
        }
        
        // Возврат на место через 1 секунду
        setTimeout(() => {
            this.x = originalX;
            this.y = originalY;
        }, 1000);
    }
    
    mirrorAttack() {
        // Зеркальная атака - снаряды летят с обеих сторон
        let playerX = game.player.x;
        let playerY = game.player.y;
        
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                // Слева
                game.addProjectile(new Projectile(0, playerY, 5, 0, true));
                // Справа
                game.addProjectile(new Projectile(800, playerY, -5, 0, true));
                // Сверху
                game.addProjectile(new Projectile(playerX, 0, 0, 5, true));
                // Снизу
                game.addProjectile(new Projectile(playerX, 600, 0, -5, true));
            }, i * 300);
        }
    }
    
    gravitationalPull() {
        // Гравитационное притяжение с последующим взрывом
        let centerX = 400;
        let centerY = 300;
        
        // Создаем снаряды по краям
        for (let i = 0; i < 20; i++) {
            let angle = (i * 18) * Math.PI / 180;
            let startX = centerX + Math.cos(angle) * 300;
            let startY = centerY + Math.sin(angle) * 200;
            
            setTimeout(() => {
                // Снаряды летят к центру
                let vx = -Math.cos(angle) * 3;
                let vy = -Math.sin(angle) * 3;
                game.addProjectile(new GravityProjectile(startX, startY, vx, vy, centerX, centerY));
            }, i * 50);
        }
    }
    
    bounceShots() {
        // Отскакивающие снаряды
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                let angle = (i * 45) * Math.PI / 180;
                let vx = Math.cos(angle) * 4;
                let vy = Math.sin(angle) * 4;
                game.addProjectile(new BouncingProjectile(this.x, this.y, vx, vy));
            }, i * 150);
        }
    }
    
    timeDelayBombs() {
        // Бомбы с задержкой
        for (let i = 0; i < 6; i++) {
            let x = 100 + i * 120;
            let y = 200 + Math.random() * 200;
            
            setTimeout(() => {
                game.addProjectile(new DelayedBomb(x, y));
            }, i * 200);
        }
    }
    
    phantomClones() {
        // Фантомные клоны атакуют
        let clonePositions = [
            [200, 150],
            [600, 150],
            [400, 250]
        ];
        
        clonePositions.forEach((pos, index) => {
            setTimeout(() => {
                for (let i = 0; i < 5; i++) {
                    let angle = (i * 72) * Math.PI / 180;
                    let vx = Math.cos(angle) * 4;
                    let vy = Math.sin(angle) * 4;
                    game.addProjectile(new Projectile(pos[0], pos[1], vx, vy, true));
                }
            }, index * 400);
        });
    }
    
    sineWaveAttack() {
        // Синусоидальная волна
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                let x = i * 16;
                let y = 300 + Math.sin(i * 0.3) * 150;
                game.addProjectile(new Projectile(x, y, 3, 0, true));
            }, i * 80);
        }
    }
    
    vortexTrap() {
        // Вихревая ловушка
        let centerX = game.player.x;
        let centerY = game.player.y;
        
        for (let ring = 0; ring < 4; ring++) {
            for (let i = 0; i < 12; i++) {
                setTimeout(() => {
                    let angle = (i * 30 + ring * 15) * Math.PI / 180;
                    let radius = 50 + ring * 30;
                    let x = centerX + Math.cos(angle) * radius;
                    let y = centerY + Math.sin(angle) * radius;
                    
                    // Спиральное движение к центру
                    let vx = -Math.cos(angle) * 2 + Math.cos(angle + Math.PI/2) * 1;
                    let vy = -Math.sin(angle) * 2 + Math.sin(angle + Math.PI/2) * 1;
                    game.addProjectile(new Projectile(x, y, vx, vy, true));
                }, ring * 300 + i * 50);
            }
        }
    }
    
    railgunSnipe() {
        // Снайперский выстрел рельсотроном
        let targetX = game.player.x;
        let targetY = game.player.y;
        
        // Предупреждение - красная линия
        setTimeout(() => {
            for (let i = 0; i < 30; i++) {
                setTimeout(() => {
                    game.addProjectile(new Projectile(this.x, this.y + i * 20, 0, 0, true, 10)); // Статичные маркеры
                }, i * 20);
            }
        }, 500);
        
        // Основной выстрел
        setTimeout(() => {
            for (let i = 0; i < 5; i++) {
                let dx = targetX - this.x;
                let dy = targetY - this.y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                let vx = (dx / dist) * 12;
                let vy = (dy / dist) * 12;
                game.addProjectile(new Projectile(this.x, this.y, vx, vy, true));
            }
        }, 1000);
    }
    
    fragmentationBurst() {
        // Разрывающиеся снаряды
        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                let angle = (i * 90) * Math.PI / 180;
                let vx = Math.cos(angle) * 3;
                let vy = Math.sin(angle) * 3;
                game.addProjectile(new FragmentProjectile(this.x, this.y, vx, vy));
            }, i * 200);
        }
    }
    
    shadowStep() {
        // Теневой шаг с множественными атаками
        let positions = [
            [200, 200],
            [600, 200],
            [400, 400],
            [200, 400],
            [600, 400]
        ];
        
        positions.forEach((pos, index) => {
            setTimeout(() => {
                // Телепорт
                this.x = pos[0];
                this.y = pos[1];
                
                // Атака из новой позиции
                let dx = game.player.x - this.x;
                let dy = game.player.y - this.y;
                let dist = Math.sqrt(dx*dx + dy*dy);
                let vx = (dx / dist) * 5;
                let vy = (dy / dist) * 5;
                
                for (let j = 0; j < 3; j++) {
                    setTimeout(() => {
                        game.addProjectile(new Projectile(this.x, this.y, vx, vy, true));
                    }, j * 100);
                }
            }, index * 300);
        });
        
        // Возврат в центр
        setTimeout(() => {
            this.x = 400;
            this.y = 100;
        }, positions.length * 300);
    }
    
    energyBarrier() {
        // Энергетический барьер, который сжимается
        for (let phase = 0; phase < 5; phase++) {
            setTimeout(() => {
                let radius = 300 - phase * 50;
                for (let i = 0; i < 16; i++) {
                    let angle = (i * 22.5) * Math.PI / 180;
                    let x = 400 + Math.cos(angle) * radius;
                    let y = 300 + Math.sin(angle) * radius;
                    
                    let vx = -Math.cos(angle) * 2;
                    let vy = -Math.sin(angle) * 2;
                    game.addProjectile(new Projectile(x, y, vx, vy, true));
                }
            }, phase * 400);
        }
    }
    
    meteorShower() {
        // Метеоритный дождь
        for (let i = 0; i < 25; i++) {
            setTimeout(() => {
                let x = Math.random() * 800;
                let y = -50;
                let vx = (Math.random() - 0.5) * 4;
                let vy = 4 + Math.random() * 3;
                game.addProjectile(new MeteorProjectile(x, y, vx, vy));
            }, Math.random() * 2000);
        }
    }
    
    collidesWith(obj) {
        return this.x - this.width/2 < obj.x + obj.width/2 &&
               this.x + this.width/2 > obj.x - obj.width/2 &&
               this.y - this.height/2 < obj.y + obj.height/2 &&
               this.y + this.height/2 > obj.y - obj.height/2;
    }
    
    takeDamage() {
        this.hp--;
        game.createParticles(this.x, this.y, '#ff6600', 8);
    }
    
    render(ctx) {
        // Эффект зарядки
        if (this.isCharging) {
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#ff0066';
            
            // Предупреждающая анимация
            let intensity = Math.sin(Date.now() * 0.02) * 0.5 + 0.5;
            ctx.globalAlpha = 0.3 + intensity * 0.4;
        }
        
        // Эффект уязвимости
        if (this.isVulnerable) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00ff00';
        }
        
        // Цвет в зависимости от фазы
        let color = '#ff0066';
        switch (this.phase) {
            case 2: color = '#ff6600'; break;
            case 3: color = '#ff0000'; break;
        }
        
        if (this.isVulnerable) color = '#66ff66';
        
        ctx.fillStyle = color;
        ctx.fillRect(this.x - this.width/2, this.y - this.height/2, this.width, this.height);
        
        // HP бар
        let hpWidth = (this.hp / this.maxHp) * this.width;
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(this.x - this.width/2, this.y - this.height/2 - 15, this.width, 8);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(this.x - this.width/2, this.y - this.height/2 - 15, hpWidth, 8);
        
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    }
}
export default Boss;
