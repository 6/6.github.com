/* 
Function to shuffle an array.
Author: Jonas Raoni Soares Silva, http://jsfromhell.com/array/shuffle [v1.0]
*/
shuffle = function(o){ //v1.0
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

// @return an integer between 0 and @param max, inclusive
function genRandom(maxInt){
    return Math.floor(Math.random()*(maxInt+1));
}

// return int between 0 and maximum not in Array arr 
function genRandomNotIn(arr, maximum){
    var rand = genRandom(maximum);
    while(jQuery.inArray(rand,arr) != -1) {
        rand = genRandom(maximum);
    }
    return rand;
}

function log(stuff) {
    console.log(stuff);
}
