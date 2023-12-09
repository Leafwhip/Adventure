const clamp = (n, min, max) => {
    return Math.min(max, Math.max(n, min));
}
const tilePos = (x, y) => {
    return [Math.floor(x / tileSize), Math.floor(y / tileSize)];
}
const tileAt = (x, y) => {
    return (map[y]||[])[x];
}
const randInt = (n) => {
    return Math.floor(Math.random() * n);
}
const rectOverlap = (x1, y1, w1, h1, x2, y2, w2, h2) => {
    let xIntervals = [[x1, x1 + w1], [x2, x2 + w2]];
    let yIntervals = [[y1, y1 + h1], [y2, y2 + h2]];
    let xOverlaps = !(xIntervals[0][0] >= xIntervals[1][1] || xIntervals[1][0] >= xIntervals[0][1]);
    let yOverlaps = !(yIntervals[0][0] >= yIntervals[1][1] || yIntervals[1][0] >= yIntervals[0][1]);
    return (xOverlaps && yOverlaps);
}
const assets = {
    red: 'https://cdn.glitch.global/8ac2ee8f-1282-4c40-ad0b-00199fa20102/red.png',
    blue: 'https://cdn.glitch.global/8ac2ee8f-1282-4c40-ad0b-00199fa20102/blue.png'
}
class Base {
    constructor() {
        this.id = ++entityID;
        this.height = 40;
        this.width = 40;
        this.speed = 1;
        this.jumpPower = 15;
        this.canJump = true;
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.vlx = 10;
        this.vly = 20;
        this.sprite = '';
        this.drawSprite = function() {
            this.sprite.position.set(this.x, this.y);
        }
        this.collideEntities = function() {
            let center1 = [this.x + this.width / 2, this.y + this.height / 2];
            entities.forEach(e2 => {
                if(this.id == e2.id) {
                    return;
                }
                let overlaps = rectOverlap(this.x, this.y, this.width, this.height, e2.x, e2.y, e2.width, e2.height);
                let center2 = [e2.x + e2.width / 2, e2.y + e2.height / 2];
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
            this.vx = clamp(this.vx, -this.vlx, this.vlx)
            this.vx *= friction;
            this.x += this.vx;
            [this.x, this.vx] = xCollide(this.x, this.y, this.vx, this.width, this.height);
        }
        this.finishY = function() {
            this.vy += gravity;
            this.vy = clamp(this.vy, -this.vly, this.vly);
            this.y += this.vy;
            [this.y, this.vy, this.canJump] = yCollide(this.x, this.y, this.vy, this.width, this.height);
        }
        this.update = function() {
            this.collideEntities();
            this.finishX();
            this.finishY();
            this.drawSprite();
        }
    }
}
class Player extends Base {
    constructor() {
        super();
        this.sprite = assets.red,
        this.update = function() {
            this.collideEntities();
            this.vx += (keys.d - keys.a) * this.speed;
            if(this.canJump && keys.w) {
                this.vy -= this.jumpPower;
                this.canJump = false;
            }
            this.finishX();
            this.finishY();
            this.drawSprite();
        }
    }
}
class Dummy extends Base {
    constructor() {
        super();
        this.sprite = assets.blue;
    }
}
const projectiles = {

}
const maps = {
    test: {
        map: [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        ],
        startPos: [1,1],
        spawns: [
            [Dummy, 10, 1],
            [Dummy, 10, 1],
            [Dummy, 10, 1],
            [Dummy, 10, 1],
            [Dummy, 10, 1],
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