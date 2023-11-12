function clamp(n,min,max) {
    return Math.max(min,Math.min(n,max));
}

function numberLine(a1,a2) {
    //only works for numbers on the same vertical or horizontal axis
    let dist = Math.abs(a2[0] - a1[0]) + Math.abs(a2[1] - a1[1]);
    let diff = [clamp(a2[0] - a1[0], -1, 1), clamp(a2[1] - a1[1], -1, 1)];
    let pos = Array.from(a1);
    let list = [];
    for(let i = 0; i <= dist; i++){
        list.push(pos);
        pos = [pos[0] + diff[0], pos[1] + diff[1]];
    }
    return list;
}