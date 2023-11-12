function loadMap(map,spawn){
    game.map = map;
    player.pos.x = spawn[0] * game.tileSize;
    player.pos.y = spawn[1] * game.tileSize;
}
function movePlayerTick(x){
    game.frames += x;
    if (game.frames > 60 / game.fps) {
        game.frames -= 60 / game.fps;
    }
    else{ 
        return;
    }

    player.updatePos();
    
    player.sprite.x = player.pos.x;
    player.sprite.y = player.pos.y;
}
function drawCharacter(){
    app.stage.addChild(player.sprite);
    
    document.body.addEventListener('keydown', player.movePress.bind(player));
    document.body.addEventListener('keyup', player.moveRelease.bind(player));

    app.ticker.add(movePlayerTick);
}
function drawMap(){
    
}