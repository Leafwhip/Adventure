const rooms = {
    square: {
        map: [
            [1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,2,0,0,1],
            [1,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1],
        ],
        scripts: {
            2: function() {
                player.vel.y -= 200;
            },
        }
    },
}

function mapPos(coordinates) {
    //The tile a point is inside
    return [Math.floor(coordinates[0]/game.tileSize),Math.floor(coordinates[1]/game.tileSize)];
}

function gamePos(coordinates) {
    //The bottom right of the tile in game coordinates
    return [(coordinates[0] + 1) * game.tileSize, (coordinates[1] + 1) * game.tileSize];
}