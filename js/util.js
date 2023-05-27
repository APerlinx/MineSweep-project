'use strict'

function shuffle(items) {
    var randIdx, keep;
    for (var i = items.length - 1; i > 0; i--) {
        randIdx = getRandomInt(0, items.length);
        keep = items[i];
        items[i] = items[randIdx];
        items[randIdx] = keep;
    }
    return items;
}

function getRandomInt(min, max) {
   // min = Math.ceil(min)
   // max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min
}



