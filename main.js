const {Application,Graphics,Sprite,Texture,Container} = PIXI;
const canvasHeight = 600;
const canvasWidth = 1200;
const app = new Application({
     background: '#285050',
     height: canvasHeight,
     width: canvasWidth,
});
const log = document.querySelector('#log');

let entityID = 0;
const tileSize = 41;
const gravity = 1;
const friction = 0.9;
const safety = 0.1;
const push = 0.1;
const player = new Player();
player.sprite = Sprite.from(player.sprite);
const entities = [];
const mapDrawer = new Graphics();
let map;
app.stage.addChild(mapDrawer);

function loadMap(_map) {
    map = _map.map;
    _map.spawns.forEach(([s, x, y]) => {
        let spawn = new s();
        let newSprite = Sprite.from(spawn.sprite);
        spawn.x = x * tileSize;
        spawn.y = y * tileSize;
        newSprite.position.set(spawn.x, spawn.y);
        spawn.sprite = newSprite;
        app.stage.addChild(newSprite);
        entities.push(spawn);
    })
    // add after = player highest z
    player.x = _map.startPos[0] * tileSize;
    player.y = _map.startPos[1] * tileSize;
    app.stage.addChild(player.sprite);
    entities.push(player);
}
loadMap(maps.test);
const keys = {
    w: false,
    s: false,
    a: false,
    d: false,
}
document.addEventListener('keydown', (e) => {
    switch(e.code) {
        case 'KeyW':
            keys.w = true;
            break;
        case 'KeyS':
            keys.s = true;
            break;
        case 'KeyA':
            keys.a = true;
            break;
        case 'KeyD':
            keys.d = true;
            break;
    }
})
document.addEventListener('keyup', (e) => {
    switch(e.code) {
        case 'KeyW':
            keys.w = false;
            break;
        case 'KeyS':
            keys.s = false;
            break;
        case 'KeyA':
            keys.a = false;
            break;
        case 'KeyD':
            keys.d = false;
            break;
    }
})
function xCollide(x, y, vx, width, height) {
    let topLeft = tilePos(x, y);
    let topRight = tilePos(x + width, y);
    let bottomLeft = tilePos(x, y + height);
    let bottomRight = tilePos(x + width, y + height);
    [topLeft, bottomLeft].forEach(tile => {
        let tileID = tileAt(tile[0], tile[1]) || 0;
        if(tileProps[tileID].solid) {
            x = tile[0] * tileSize + tileSize + safety;
            vx = 0;
        }
    });
    [topRight, bottomRight].forEach(tile => {
        let tileID = tileAt(tile[0], tile[1]) || 0;
        if(tileProps[tileID].solid) {
            x = tile[0] * tileSize - width - safety;
            vx = 0;
        }
    });
    return [x, vx];
}
function yCollide(x, y, vy, width, height) {
    let canJump = false;
    let topLeft = tilePos(x, y);
    let topRight = tilePos(x + width, y);
    let bottomLeft = tilePos(x, y + height);
    let bottomRight = tilePos(x + width, y + height);
    [topLeft, topRight].forEach(tile => {
        let tileID = tileAt(tile[0], tile[1]) || 0;
        if(tileProps[tileID].solid) {
            y = tile[1] * tileSize + tileSize + safety;
            vy = 0;
        }
    });
    [bottomLeft, bottomRight].forEach(tile => {
        let tileID = tileAt(tile[0], tile[1]) || 0;
        if(tileProps[tileID].solid) {
            y = tile[1] * tileSize - height - safety;
            vy = 0;
            canJump = true;
        }
    });
    return [y, vy, canJump];
}
function drawMap() {
    mapDrawer.clear();
    for(let y = 0; y < map.length; y++) {
        for(let x = 0; x < map[y].length; x++) {
            mapDrawer.beginFill(tileProps[+map[y][x]].color)
            .drawRect(x * tileSize, y * tileSize, tileSize, tileSize)
            .endFill();
        }
    }
}
function tick(time) {
    entities.forEach(e => {
        e.update();
    })
    drawMap();
}

app.ticker.add(tick);

document.body.appendChild(app.view)