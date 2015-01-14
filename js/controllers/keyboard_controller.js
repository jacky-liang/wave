/**
 * Created by jacky on 1/3/15.
 */

var key_pressed = {
    w : false, //W forward
    a : false, //A left
    s : false, //S backward
    d : false, //D right
    i : false, //I look up
    j : false, //J look left
    k : false, //K look down
    l : false, //L look right
    q : false, //Q up
    e : false, //E down
    u : false, //U roll left
    o : false  //O roll right
};

function codeToChar(code){
    switch(code){
        case 87:
            return 'w';
        case 65:
            return 'a';
        case 83:
            return 's';
        case 68:
            return 'd';
        case 73:
            return 'i';
        case 74:
            return 'j';
        case 75:
            return 'k';
        case 76:
            return 'l';
        case 81:
            return 'q';
        case 69:
            return 'e';
        case 85:
            return 'u';
        case 79:
            return 'o';
        default:
            return false;
    }
}

var allow_key_board = true;

$(document).keydown(function(e){
    if(e.keyCode == "R".charCodeAt(0))
        reset();
    else if(e.keyCode == "V".charCodeAt(0))
        enableVRMode();
    else if(e.keyCode == "T".charCodeAt(0))
        toggleOrient();

    var key = codeToChar(e.which);
    if(key_pressed.hasOwnProperty(key) && allow_key_board)
        key_pressed[key] = true;
});

$(document).keyup(function(e){
   var key = codeToChar(e.which);
    if(key_pressed.hasOwnProperty(key) && allow_key_board)
        key_pressed[key] = false;
});