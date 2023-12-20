const {Application, Graphics, Sprite, Texture, Container, Text, TextStyle, ParticleContainer} = PIXI;
const canvasHeight = 600;
const canvasWidth = 1200;
const app = new Application({
     background: '#285050',
     height: canvasHeight,
     width: canvasWidth,
});
const displayTextStyle = new TextStyle({
    fontFamily: 'Montserrat',
    fontSize: 24,
    fill: 'black',
    stroke: 'ffffff',
    strokeThickness: 1,
})
const healthTextStyle = new TextStyle({
    fontFamily: 'Montserrat',
    fontSize: 18,
    fill: 'ff0000',
})

const log = document.querySelector('#log');

let mapDrawer = new Graphics();
let map;
app.stage.addChild(mapDrawer);
let playerHealthText = new Text("Player Health: 0", displayTextStyle);
let dummyHealthText = new Text("Dummy Health: 0", displayTextStyle);
let winText = new Text("", displayTextStyle);
let loseText = new Text("", displayTextStyle);
let howToPlayText = new Text("How to play: WASD to move, K to melee attack, L to laser attack, O to bomb attack, H to heal, R to restart", displayTextStyle);
dummyHealthText.position.x = 500;
winText.position.x = 300;
loseText.position.x = 300;
howToPlayText.position.y = 550;
app.stage.addChild(playerHealthText);
app.stage.addChild(dummyHealthText);
app.stage.addChild(winText);
app.stage.addChild(loseText);
app.stage.addChild(howToPlayText);

let entityID = 0;
const tileSize = 41;
const safety = 0.1;
const push = 0.05;
let player = new Player(0, 0);
let entities = [];

function loadMap(_map) {
    entities.forEach(entity => entity.kill());
    map = _map.map;
    _map.spawns.forEach(([e, x, y]) => {
        let entity = new e(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2);
        summonEntity(entity);
    })
    // add after = player highest z
    player.x = _map.startPos[0] * tileSize + tileSize / 2;
    player.y = _map.startPos[1] * tileSize + tileSize / 2;
    summonEntity(player)
}
loadMap(maps.test);
function summonEntity(entity) {
    let newSprite = entity.sprite;
    newSprite.position.set(entity.x - entity.width / 2, entity.y - entity.height / 2);
    entity.sprite = newSprite;
    app.stage.addChild(newSprite);
    entities.push(entity);
}
function restart() {
    winText.text = "";
    loseText.text = "";
    player = new Player(0, 0);
    loadMap(maps.test);
}
const keys = {
    w: false,
    s: false,
    a: false,
    d: false,
    k: false,
    l: false,
    o: false,
    h: false,
}
let leftOrRightRecent = true;
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
            leftOrRightRecent = false;
            break;
        case 'KeyD':
            keys.d = true;
            leftOrRightRecent = true;
            break;
        case 'KeyK':
            keys.k = true;
            break;
        case 'KeyL':
            keys.l = true;
            break;
        case 'KeyO':
            keys.o = true;
            break;
        case 'KeyH':
            keys.h = true;
            break;
        case 'KeyR':
            restart();
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
        case 'KeyK':
            keys.k = false;
            break;
        case 'KeyL':
            keys.l = false;
            break;
        case 'KeyO':
            keys.o = false;
            break;
        case 'KeyH':
            keys.h = false;
            break;
    }
})
function xCollide(x, y, width, height) {
    let collided = false;
    let leftTiles = [];
    let rightTiles = [];
    let topLeft = tilePos(x - width / 2, y - height / 2);
    let topRight = tilePos(x + width / 2, y - height / 2);
    let bottomLeft = tilePos(x - width / 2, y + height / 2);
    let bottomRight = tilePos(x + width / 2, y + height / 2);
    if(width < tileSize) {
        leftTiles = [topLeft, bottomLeft];
        rightTiles = [topRight, bottomRight];
    }
    else {
        leftTiles = lineOfPoints(topLeft, bottomLeft);
        rightTiles = lineOfPoints(topRight, bottomRight);
    }
    leftTiles.forEach(tile => {
        let tileID = tileAt(tile[0], tile[1]) || 0;
        if(tileProps[tileID].solid) {
            x = tile[0] * tileSize + tileSize + width / 2 + safety;
            collided = true;
        }
    });
    rightTiles.forEach(tile => {
        let tileID = tileAt(tile[0], tile[1]) || 0;
        if(tileProps[tileID].solid) {
            x = tile[0] * tileSize - width / 2 - safety;
            collided = true;
        }
    });
    return [x, collided];
}
function yCollide(x, y, width, height) {
    let collided = false;
    let canJump = false;
    let topTiles = [];
    let bottomTiles = [];
    let topLeft = tilePos(x - width / 2, y - height / 2);
    let topRight = tilePos(x + width / 2, y - height / 2);
    let bottomLeft = tilePos(x - width / 2, y + height / 2);
    let bottomRight = tilePos(x + width / 2, y + height / 2);
    if(height < tileSize) {
        topTiles = [topLeft, topRight];
        bottomTiles = [bottomLeft, bottomRight];
    }
    else {
        topTiles = lineOfPoints(topLeft, topRight);
        bottomTiles = lineOfPoints(bottomLeft, bottomRight);
    }
    topTiles.forEach(tile => {
        let tileID = tileAt(tile[0], tile[1]) || 0;
        if(tileProps[tileID].solid) {
            y = tile[1] * tileSize + tileSize + height / 2 + safety;
            collided = true;
        }
    });
    bottomTiles.forEach(tile => {
        let tileID = tileAt(tile[0], tile[1]) || 0;
        if(tileProps[tileID].solid) {
            y = tile[1] * tileSize - height / 2 - safety;
            canJump = true;
            collided = true;
        }
    });
    return [y, canJump, collided];
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
function updateText() {
    playerHealthText.text = `Player health: ${player.health}`;
    dummyHealthText.text = `Dummy health: ${entities.find(a => a.team == "dummy")?.health || 0}`;
}
function updateEntities() {
    app.stage.children.sort((a, b) => a.zIndex - b.zIndex);
    entities.forEach(entity => {
        entity.update();
    })
}
function checkWin() {
    if(entities.filter(entity => entity.projectile == false).length == 1 && player.health > 0) {
        winText.text = "You win!!!";
    }
    if(player.health == 0) {
        loseText.text = "You lose :("
    }
}
function tick(time) {
    updateEntities();
    drawMap();
    updateText();
    checkWin();
}

app.ticker.add(tick);

document.body.appendChild(app.view)