const {Application,Assets,Graphics,Sprite,Texture} = PIXI;
const app = new Application({ background: '#7d613e', resizeTo: window });
const canvas=app.view;
const game = {
    fps: 30,
    tileSize: 40,
    gravity: 1,
    friction: 0.2,
    map: [],
    frames: 0,
}
const player = new Player();
async function start() {
    await loadAssets();
    player.sprite = Sprite.from(assets.all.character);
    document.body.appendChild(app.view);
    loadMap(rooms.square,[2,4]);
    drawCharacter();
}
start();