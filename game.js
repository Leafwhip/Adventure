function loadMap(map){

}
function drawCharacter(){
    const character = Sprite.from(assets.all.character);
    app.stage.addChild(character);

    
    document.body.addEventListener('keydown',movePress);
    document.body.addEventListener('keyup',moveRelease);

    let frames = 0;
    app.ticker.add((x)=>{
        frames += x;
        if (frames > 60 / game.fps) {
            frames -= 60 / game.fps;
        }
        else{ 
            return;
        }

        player.vel.x = player.vel.x - player.vel.x * game.friction;
        player.vel.x = clamp(player.vel.x + player.movement.speed * (player.inputs.right - player.inputs.left), -player.velLimit.x, player.velLimit.x);
        
        if(player.inputs.up && player.movement.canJump){
            player.movement.canJump = false;
            player.vel.y -= player.movement.jump;
        }
        player.vel.y = clamp(player.vel.y + game.gravity, -player.velLimit.y, player.velLimit.y);

        player.pos.x += player.vel.x;
        player.pos.y += player.vel.y;

        if(player.pos.y >= 400){
            player.pos.y = 400;
            player.vel.y = 0;
            player.movement.canJump = true;
        }
        character.x = player.pos.x;
        character.y = player.pos.y;
    })
}