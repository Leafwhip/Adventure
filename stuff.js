const clamp = (n, min, max) => {
    return Math.min(max, Math.max(n, min));
}
const tilePos = (x, y) => {
    return [Math.floor(x / tileSize), Math.floor(y / tileSize)];
}
const tileAt = (x, y) => {
    return (map[y]||[])[x];
}
const mDist = (pos1, pos2) => {
    return Math.abs(pos1[0] - pos2[0]) + Math.abs(pos1[1] - pos2[1]);
}
const eDist = (pos1, pos2) => {
    return Math.sqrt((pos2[0] - pos1[0]) ** 2 + (pos2[1] - pos1[1]) ** 2);
}
const randInt = (n) => {
    return Math.floor(Math.random() * n);
}
const ballisticX = (vy, g, a, b) => {
    return a * g / (vy + Math.sqrt(vy * vy - 2 * b * g));
}
const ballisticY = (vx, g, a, b) => {
    return b * vx / a + g * a / (2 * vx);
}
const lineOfPoints = (pos1, pos2) => {
    let currentPos = [...pos1];
    let line = [[...pos1]];
    let xStep = Math.sign(pos2[0] - pos1[0]);
    let yStep = Math.sign(pos2[1] - pos1[1]);
    let dist = mDist(pos1, pos2);
    for(let i = 0; i < dist; i++) {
        currentPos[0] += xStep;
        currentPos[1] += yStep;
        line.push([...currentPos]);
    }
    return line;
}
const rectOverlap = (x1, y1, w1, h1, x2, y2, w2, h2) => {
    let xIntervals = [[x1, x1 + w1], [x2, x2 + w2]];
    let yIntervals = [[y1, y1 + h1], [y2, y2 + h2]];
    let xOverlaps = !(xIntervals[0][0] >= xIntervals[1][1] || xIntervals[1][0] >= xIntervals[0][1]);
    let yOverlaps = !(yIntervals[0][0] >= yIntervals[1][1] || yIntervals[1][0] >= yIntervals[0][1]);
    return (xOverlaps && yOverlaps);
}
const entityOverlap = (e1, e2) => {
    return rectOverlap(e1.x - e1.width / 2, e1.y - e1.height / 2, e1.width, e1.height, e2.x - e2.width / 2, e2.y - e2.height / 2, e2.width, e2.height);
}
const assets = {
    red: 'https://cdn.glitch.global/8ac2ee8f-1282-4c40-ad0b-00199fa20102/red.png?v=1701150082605',
    blue: 'https://cdn.glitch.global/8ac2ee8f-1282-4c40-ad0b-00199fa20102/blue.png?v=1701569602036',
    lime: 'https://cdn.glitch.global/8ac2ee8f-1282-4c40-ad0b-00199fa20102/lime.png?v=1702177634592',
    green: 'https://cdn.glitch.global/8ac2ee8f-1282-4c40-ad0b-00199fa20102/green.png?v=1702181108017',
    rock: 'https://cdn.glitch.global/8ac2ee8f-1282-4c40-ad0b-00199fa20102/rock.png?v=1702352479239',
    blank: 'https://cdn.glitch.global/8ac2ee8f-1282-4c40-ad0b-00199fa20102/blank.png?v=1702608744171',
    attack: 'https://cdn.glitch.global/8ac2ee8f-1282-4c40-ad0b-00199fa20102/Attackradius.png?v=1702623215365',
    goblingiant: 'https://cdn.glitch.global/8ac2ee8f-1282-4c40-ad0b-00199fa20102/goblingiant.png?v=1702713132654',
    laser: 'https://cdn.glitch.global/8ac2ee8f-1282-4c40-ad0b-00199fa20102/laser.png?v=1702795771328',
    heal: 'https://cdn.glitch.global/8ac2ee8f-1282-4c40-ad0b-00199fa20102/heal.png?v=1702965101773',
    bomb: 'https://cdn.glitch.global/8ac2ee8f-1282-4c40-ad0b-00199fa20102/bomb.png?v=1702966619926',
}
class Base {
    constructor(x, y) {
        this.id = ++entityID;
        this.team = "dummy";
        this.height = 40;
        this.width = 40;
        this.speed = 1;
        this.jumpPower = 15;
        this.canJump = true;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.vlx = 20;
        this.vly = 20;
        this.gravity = 1;
        this.friction = 0.9;
        this.maxHealth = 100;
        this.health = 100;
        this.sprite = null;
        this.attacks = [];
        this.collisions = [false, false];
        this.ghost = false;
        this.projectile = false;
        this.immune = new Set();
        this.healthBar = new Text("", healthTextStyle);
        this.dead = false;
        app.stage.addChild(this.healthBar);
        this.onDeath = function() {}
        this.kill = function() {
            if(!this.dead) {
                this.dead = true;
                this.onDeath();
                entities = entities.filter(entity => entity.id != this.id);
                app.stage.removeChild(this.sprite);
                app.stage.removeChild(this.healthBar);
            }
        }
        this.drawSprite = function() {
            this.sprite.position.set(this.x - this.width / 2, this.y - this.height / 2);
        }
        this.collideEntities = function() {
            let center1 = [this.x, this.y]
            entities.forEach(e2 => {
                if(this.id == e2.id || e2.projectile == true) {
                    return;
                }
                let overlaps = entityOverlap(this, e2);
                let center2 = [e2.x, e2.y];
                if(overlaps) {
                    let dx = center1[0] - center2[0];
                    if(dx > 0) {
                        this.vx += push;
                    }
                    if(dx < 0) {
                        this.vx -= push;
                    }
                    if(dx == 0) {
                        this.vx += [-push, push][randInt(2)];
                    }
                    let dy = center1[1] - center2[1];
                    if(dy > 0) {
                        this.vy += push;
                    }
                    if(dy < 0) {
                        this.vy -= push;
                    }
                    if(dy == 0) {
                        this.vy += [-push, push][randInt(2)];
                    }
                }
            })
        }
        this.finishX = function() {
            this.vx *= this.friction;
            this.vx = clamp(this.vx, -this.vlx, this.vlx);
            this.x += this.vx;
            if(!this.ghost) {
                [this.x, this.collisions[0]] = xCollide(this.x, this.y, this.width, this.height);
            }
            if(this.collisions[0] && !this.bounceOnWall) {
                this.vx = 0;
            }
            if(this.collisions[0] && this.bounceOnWall) {
                this.vx *= -1;
            }
        }
        this.finishY = function() {
            if(!this.laser) {
                this.vy += this.gravity;
            }
            this.vy = clamp(this.vy, -this.vly, this.vly);
            this.y += this.vy;
            if(!this.ghost) {
                [this.y, this.canJump, this.collisions[1]] = yCollide(this.x, this.y, this.width, this.height);
            }
            if(this.collisions[1] && !this.bounceOnWall) {
                this.vy = 0;
            }
            if(this.collisions[1] && this.bounceOnWall) {
                this.vy *= -0.7;
            }
        }
        this.updateBars = function() {
            this.healthBar.text = `${this.health} / ${this.maxHealth}`;
            this.healthBar.position.set(this.x - this.healthBar.width / 2, this.y - this.height / 2 - this.healthBar.height);
        }
        this.special = function() {}
        this.update = function() {
            if(this.health <= 0) {
                this.kill();
            }
            this.special();
            this.attacks.forEach(attack => {
                attack.maybeAttack();
            })
            this.collideEntities();
            this.finishX();
            this.finishY();
            this.drawSprite();
            this.updateBars();
        }
    }
}
class Projectile extends Base {
    constructor(x, y, vx, vy) {
        super(x, y);
        this.projectile = true;
        this.vx = vx;
        this.vy = vy;
        this.bounceOnWall = false;
        this.dieOnWall = false;
        this.dieOnEntity = false;
        this.laser = false;
        this.damage = 10;
        this.life = Infinity;
        this.hit = function(entity) {}
        this.update = function() {
            this.special();
            if((this.collisions[0] || this.collisions[1]) && this.dieOnWall) {
                this.kill();
            }
            if((this.collisions[0] || this.collisions[1]) && this.dieOnWall) {
                this.kill();
            }
            this.life--;
            if(this.life <= 0) {
                this.kill();
            }
            this.collideEntities();
            this.finishX();
            this.finishY();
            this.drawSprite();
        }
        this.collideEntities = function() {
            entities.forEach(e2 => {
                if(this.team == e2.team || e2.projectile == true) {
                    return;
                }
                let overlaps = entityOverlap(this, e2);
                if(overlaps) {
                    this.hit(e2);
                    if(this.dieOnEntity) {
                        this.kill();
                    }
                }
            })
        }
    }
}
class Player extends Base {
    constructor(x, y) {
        super(x, y);
        this.team = "player";
        this.maxHealth = 1000;
        this.health = 1000;
        this.sprite = Sprite.from(assets.red);
        this.attacks.push(
            {
                dad: this,
                attack: function() {
                    let attack = new PlayerAttack(this.dad.x, this.dad.y, 0, 0);
                    summonEntity(attack);
                },
                maybeAttack: function() {
                    this.timer--;
                    if(this.timer <= 0 && keys.k) {
                        this.timer = this.cooldown;
                        this.attack();
                    }
                },
                cooldown: 60,
                timer: 0,
            },
            {
                dad: this,
                attack: function() {
                    let laser = new PlayerLaser(this.dad.x, this.dad.y, 5 * (leftOrRightRecent ? 1 : -1), Math.random() * this.spread * 2 - this.spread);
                    summonEntity(laser);
                },
                maybeAttack: function() {
                    this.timer--;
                    if(this.timer <= 0 && keys.l) {
                        this.timer = this.cooldown;
                        this.attack();
                    }
                },
                cooldown: 30,
                spread: 0.5,
                timer: 0,
            },
            {
                dad: this,
                attack: function() {
                    let bomb = new PlayerBomb(this.dad.x, this.dad.y, 5 * (leftOrRightRecent ? 1 : -1), -7);
                    summonEntity(bomb);
                },
                maybeAttack: function() {
                    this.timer--;
                    if(this.timer <= 0 && keys.o) {
                        this.timer = this.cooldown;
                        this.attack();
                    }
                },
                cooldown: 180,
                timer: 0,
            },
            {
                dad: this,
                attack: function() {
                    this.dad.health += 100;
                    this.dad.health = Math.min(this.dad.health, this.dad.maxHealth);
                    for(let i = 0; i < 20; i++) {
                        let healParticle = new PlayerHeal(this.dad.x, this.dad.y, 0, 0);
                        summonEntity(healParticle);
                    }
                },
                maybeAttack: function() {
                    this.timer--;
                    if(this.timer <= 0 && keys.h) {
                        this.timer = this.cooldown;
                        this.attack();
                    }
                },
                cooldown: 240,
                timer: 0,
            },
        )
        this.special = function() {
            this.vx += (keys.d - keys.a) * this.speed;
            if(this.canJump && keys.w) {
                this.vy -= this.jumpPower;
                this.canJump = false;
            }
        }
    }
}
class PlayerAttack extends Projectile {
    constructor(x, y, vx, vy) {
        super(x, y, vx, vy);
        this.team = "player";
        this.width = 50;
        this.height = 50;
        this.gravity = 0;
        this.ghost = true;
        this.sprite = Sprite.from(assets.attack);
        this.life = 2;
        this.hit = function(entity) {
            if(!entity.immune.has(this.id)) {
                entity.immune.add(this.id);
            }
            else {
                return;
            }
            entity.health -= this.damage;
        }
    }
}
class PlayerLaser extends Projectile {
    constructor(x, y, vx, vy) {
        super(x, y, vx, vy);
        this.team = "player";
        this.laser = true;
        this.friction = 1;
        this.life = 600;
        this.dieOnWall = true;
        this.damage = 1;
        let velRadius = eDist([0, 0], [this.vx, this.vy]);
        this.width = Math.abs(this.vx / velRadius * 30);
        this.height = Math.abs(this.vy / velRadius * 35);
        this.sprite = Sprite.from(assets.laser);
        this.sprite.rotation = Math.atan(this.vy / this.vx);
        this.hit = function(entity) {
            entity.health -= this.damage;
        }
    }
}
class PlayerBomb extends Projectile {
    constructor(x, y, vx, vy) {
        super(x, y, vx, vy);
        this.team = "player";
        this.width = 30;
        this.height = 30;
        this.friction = 0.999;
        this.life = 150;
        this.gravity = 0.25;
        this.bounceOnWall = true;
        this.dieOnEntity = true;
        this.sprite = Sprite.from(assets.bomb);
        this.onDeath = function() {
            let explosion = new PlayerExplosion(this.x, this.y, 0, 0);
            console.log(this.id)
            summonEntity(explosion);
        }
    }
}
class PlayerExplosion extends Projectile {
    constructor(x, y, vx, vy) {
        super(x, y, vx, vy);
        this.team = "player";
        this.width = 0;
        this.height = 0;
        this.gravity = 0;
        this.damage = 50;
        this.ghost = true;
        this.sprite = Sprite.from(assets.attack);
        this.life = 60;
        this.hit = function(entity) {
            if(!entity.immune.has(this.id)) {
                entity.immune.add(this.id);
            }
            else {
                return;
            }
            entity.health -= this.damage;
        }
        this.special = function() {
            const sizeDivisor = 15;
            this.sprite.scale.set((60 - this.life) / sizeDivisor);
            this.width = 50 * (60 - this.life) / sizeDivisor;
            this.height = 50 * (60 - this.life) / sizeDivisor;
        }
    }
}
class PlayerHeal extends Projectile {
    constructor(x, y, vx, vy) {
        super(x, y, vx, vy);
        this.team = "player";
        this.laser = true;
        this.ghost = true;
        this.friction = 1;
        this.life = 120;
        this.damage = 0;
        this.sprite = Sprite.from(assets.heal);
        let spriteScale = Math.random() + 0.5;
        this.sprite.scale.set(spriteScale, spriteScale);
        this.width = 5 * spriteScale;
        this.height = 5 * spriteScale;
        this.vx = Math.random() * 2 - 1;
        this.vy = Math.random() * 2 - 1;
        this.special = function() {
            this.sprite.alpha = this.life / 120;
        }
    }
}
class Dummy extends Base {
    constructor(x, y) {
        super(x, y);
        this.sprite = Sprite.from(assets.blue);
    }
}
class RockGoblin extends Base {
    constructor(x, y) {
        super(x, y);
        this.team = "goblin";
        this.sprite = Sprite.from(assets.lime);
        this.attacks.push(
            {
                dad: this,
                attack: function() {
                    let rock = new Rock();
                    let vxThrow = (player.x - this.dad.x) / tileSize / 2;
                    let vyThrow = -Math.max(ballisticY(vxThrow, rock.gravity, player.x - this.dad.x, this.dad.y - player.y) || Infinity, 0);
                    let thrownRock = new Rock(this.dad.x, this.dad.y, vxThrow, vyThrow);
                    summonEntity(thrownRock);
                },
                maybeAttack: function() {
                    this.timer--;
                    if(this.timer <= 0) {
                        this.timer = this.cooldown;
                        this.attack() + randInt(this.randomness * 2) - this.randomness;
                    }
                },
                cooldown: 180,
                randomness: 20,
                timer: 0,
            }
        )
    }
}
class Rock extends Projectile {
    constructor(x, y, vx, vy) {
        super(x, y, vx, vy);
        this.team = "goblin";
        this.width = 20;
        this.height = 20;
        this.friction = 0.999;
        this.gravity = 0.1;
        this.life = 600;
        this.dieOnWall = true;
        this.dieOnEntity = true;
        this.sprite = Sprite.from(assets.rock);
        this.hit = function(entity) {
            if(!entity.immune.has(this.id)) {
                entity.immune.add(this.id);
            }
            else {
                return;
            }
            entity.health -= this.damage;
        }
    }
}
class Goblin extends Base {
    constructor(x, y) {
        super(x, y);
        this.team = 'goblin';
        this.speed = 0.1;
        this.sprite = Sprite.from(assets.green);
        this.attacks.push(
            {
                dad: this,
                attack: function() {
                    let attack = new GoblinAttack(this.dad.x, this.dad.y, 0, 0);
                    summonEntity(attack);
                },
                maybeAttack: function() {
                    this.timer--;
                    if(this.timer <= 0 && entityOverlap(this.dad, player)) {
                        this.timer = this.cooldown;
                        this.attack();
                    }
                },
                cooldown: 120,
                timer: 0,
            }
        )
        this.special = function() {
            this.vx += this.speed * Math.sign(player.x - this.x);
        }
    }
}
class GoblinAttack extends Projectile {
    constructor(x, y, vx, vy) {
        super(x, y, vx, vy);
        this.width = 50;
        this.height = 50;
        this.team = "goblin";
        this.gravity = 0;
        this.ghost = true;
        this.dieOnEntity = true;
        this.sprite = Sprite.from(assets.attack);
        this.life = 2;
        this.hit = function(entity) {
            if(!entity.immune.has(this.id)) {
                entity.immune.add(this.id);
            }
            else {
                return;
            }
            entity.health -= this.damage;
        }
    }
}
class GoblinGiant extends Base {
    constructor(x, y) {
        super(x, y);
        this.team = "goblin";
        this.width = 70;
        this.height = 70;
        this.maxHealth = 300;
        this.health = 300;
        this.speed = 0.14;
        this.sprite = Sprite.from(assets.goblingiant);
        this.attacks.push(
            {
                dad: this,
                attack: function() {
                    let attack = new GoblinGiantAttack(this.dad.x, this.dad.y, 0, 0);
                    summonEntity(attack);
                },
                maybeAttack: function() {
                    this.timer--;
                    if(this.timer <= 0 && entityOverlap(this.dad, player)) {
                        this.timer = this.cooldown;
                        this.attack();
                    }
                },
                cooldown: 180,
                timer: 0,
            },
            {
                dad: this,
                attack: function() {
                    let rock = new Rock();
                    let vxThrow = (player.x - this.dad.x) / tileSize / 2;
                    let vyThrow = -Math.max(ballisticY(vxThrow, rock.gravity, player.x - this.dad.x, this.dad.y - player.y) || Infinity, 0);
                    let thrownRock = new Rock(this.dad.x, this.dad.y, vxThrow, vyThrow);
                    summonEntity(thrownRock);
                },
                maybeAttack: function() {
                    this.timer--;
                    if(this.timer <= 0) {
                        this.timer = this.cooldown + randInt(this.randomness * 2) - this.randomness;
                        this.attack();
                    }
                },
                cooldown: 240,
                randomness: 30,
                timer: 0,
            }
        )
        this.special = function() {
            this.vx += this.speed * Math.sign(player.x - this.x);
        }
    }
}
class GoblinGiantAttack extends Projectile {
    constructor(x, y, vx, vy) {
        super(x, y, vx, vy);
        this.width = 90;
        this.height = 90;
        this.team = "goblin";
        this.gravity = 0;
        this.ghost = true;
        this.dieOnEntity = true;
        this.sprite = Sprite.from(assets.attack);
        this.sprite.scale.set(1.8, 1.8)
        this.life = 2;
        this.damage = 20;
        this.hit = function(entity) {
            if(!entity.immune.has(this.id)) {
                entity.immune.add(this.id);
            }
            else {
                return;
            }
            let direction = Math.sign(entity.x - this.x);
            entity.vx += direction * 10;
            entity.vy -= 10;
            entity.health -= this.damage;
        }
    }
}
const maps = {
    test: {
        map: [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        ],
        startPos: [1, 1],
        spawns: [
            [Dummy, 10, 1],
            [RockGoblin, 13, 1],
            [Goblin, 6, 1],
            [GoblinGiant, 8, 4],
        ]
    }
}
const tileProps = [
    {
        solid: false,
        color: '444444',
    },
    {
        solid: true,
        color: '222222',
    }
]