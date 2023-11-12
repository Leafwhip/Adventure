const rooms = {
    test: {
        map: [
            [1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,1,0,0,1],
            [1,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,0,0,1],
            [1,0,0,0,0,0,0,0,0,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        ],
        keys: {
            0: {
                solid: false,
            },
            1: {
                solid: true,
            }
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

function getTile(coordinates) {
    let tile = (game.map.map[coordinates[1]]||[])[coordinates[0]] || 0;
    return [tile, game.map.keys[tile]];
}