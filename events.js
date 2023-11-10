function moveEvent(key,press){
    switch(key.code){
        case 'ArrowUp':
        case 'KeyW':
            player.inputs.up = press;
            break;
        case 'ArrowDown':
        case 'KeyS':
            player.inputs.down = press;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            player.inputs.left = press;
            break;
        case 'ArrowRright':
        case 'KeyD':
            player.inputs.right = press;
            break;
    }
}

function movePress(key) {
    moveEvent(key, true);
}

function moveRelease(key) {
    moveEvent(key, false)
}