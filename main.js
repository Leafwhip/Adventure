const {Application,Assets,Graphics,Sprite,Texture} = PIXI;
const app = new Application({ background: '#7d613e', resizeTo: window });
const canvas=app.view;
const game = {
    fps: 30,
    tileSize: 40,
    gravity: 1,
    friction: 0.2,
}
const player = {
    size: {
        width: 64,
        height: 64,
    },
    movement: {
        speed: 5,
        jump: 100,
        canJump: 0,
    },
    vel: {
        x: 0,
        y: 0,
    },
    velLimit: {
        x: 10,
        y:15,
    },
    pos: {
        x: 0,
        y: 0,
    },
    inputs: {
        up: 0,
        down: 0,
        left: 0,
        right: 0,
    }
}
async function start() {
    await loadAssets();
    document.body.appendChild(app.view);
    loadMap(rooms.square)
    drawCharacter();
}
start();