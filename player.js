class Player {
    constructor() {
        this.width = 64,
        this.height = 64,
        this.speed = 5,
        this.jumpPower = 100,
        this.canJump = 0,
        
        this.vel = {
            x: 0,
            y: 0,
        }
        this.velLimit = {
            x: 10,
            y:15,
        }
        this.pos = {
            x: 0,
            y: 0,
        }
        this.inputs = {
            up: 0,
            down: 0,
            left: 0,
            right: 0,
        }
        this.sprite;
    }
    updatePos() {
        this.vel.x = this.vel.x * game.friction;
        this.vel.x = clamp(this.vel.x + this.speed * (this.inputs.right - this.inputs.left), -this.velLimit.x, player.velLimit.x);
        this.pos.x += this.vel.x;
        this.checkHorizontal();

        if(player.inputs.up && player.canJump){
            this.canJump = false;
            this.vel.y -= this.jumpPower;
        }
        this.vel.y = clamp(this.vel.y + game.gravity, -this.velLimit.y, this.velLimit.y);
        this.pos.y += this.vel.y;
        this.checkVertical();
    }
    checkHorizontal() {
        let topLeft = mapPos([this.pos.x, this.pos.y]);
        let bottomRight = mapPos([this.pos.x + this.width, this.pos.y + this.height]);
        let leftWall = numberLine(topLeft, [topLeft[0], bottomRight[1]]);
        let rightWall = numberLine([bottomRight[0],topLeft[1]], bottomRight);
        
        leftWall.forEach((coords) => {
            let tile = (game.map.map[coords[1]]||[])[coords[0]];
            if(tile == 1) {
                this.vel.x = 0;
                this.pos.x = gamePos(coords)[0] + game.safety;
            }
        });

        rightWall.forEach((coords) => {
            let tile = (game.map.map[coords[1]]||[])[coords[0]];
            if(tile == 1) {
                this.vel.x = 0;
                this.pos.x = gamePos(coords)[0] - game.tileSize - this.width - game.safety;
            }
        });
    }
    checkVertical() {
        let topLeft = mapPos([this.pos.x, this.pos.y]);
        let bottomRight = mapPos([this.pos.x + this.width, this.pos.y + this.height]);
        let topWall = numberLine(topLeft, [bottomRight[0], topLeft[1]]);
        let bottomWall = numberLine([topLeft[0], bottomRight[1]], bottomRight);
        
        topWall.forEach((coords) => {
            let tile = (game.map.map[coords[1]]||[])[coords[0]];
            if(tile == 1) {
                this.vel.y = 0;
                this.pos.y = gamePos(coords)[1] + game.safety;
            }
        });

        bottomWall.forEach((coords) => {
            let tile = (game.map.map[coords[1]]||[])[coords[0]];
            if(tile == 1) {
                this.vel.y = 0;
                this.pos.y = gamePos(coords)[1] - game.tileSize - player.height - game.safety;
                this.canJump = true;
            }
        });
    }

    moveEvent(key,press) {
        switch(key.code){
            case 'ArrowUp':
            case 'KeyW':
                this.inputs.up = press;
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.inputs.down = press;
                break;
            case 'ArrowLeft':
            case 'KeyA':
                this.inputs.left = press;
                break;
            case 'ArrowRright':
            case 'KeyD':
                this.inputs.right = press;
                break;
        }
    }
    
    movePress(key) {
        this.moveEvent(key, true);
    }
    
    moveRelease(key) {
        this.moveEvent(key, false)
    }
}