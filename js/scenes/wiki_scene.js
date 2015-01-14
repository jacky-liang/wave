/**
 * Created by jacky on 12/27/14.
 * Main Scene File
 * Depends on three leap controller and leap controller and all their dependencies
 */


//array of nodes that have already been constructed
var occupied = [],
    constructed = [];
//world wide length dimension scale. used to easily control relative distances and size of 3D objects.
const scale = 0.7;
//maximum nodes that can be constructed
const constructed_limit = 15;

var changeLoadingMsg = function(msg){
    $('.loading-msg').html(msg);
};

var resetLoadingMsg = function(){
    changeLoadingMsg('');
};

var showLoadingScreen = function(message){
    changeLoadingMsg(message);
    $('.loading-screen').show();
};

var hideLoadingScreen = function(){
    $('.loading-screen').hide();
    resetLoadingMsg();
};

//Text Geometry Constructor
var geo_TextGeometry = function(text,size){
    return new THREE.TextGeometry( text, {
        size: size,
        height: 0.05,
        curveSegments: 6,
        font: "helvetiker",
        weight: "normal",
        style: "normal" });
};

//Materials
var matte_browishgreen = new THREE.MeshPhongMaterial( { color: 0xD0D45D } );

function checkPosition(pos){
    var hasRepeats = false;
    for(var i = 0;i<occupied.length;i++)
        if(occupied[i].equals(pos)){
            hasRepeats = true;
            break;
        }
    if(hasRepeats)
        return checkPosition(pos.add(new THREE.Vector3(0,0,2)));
    else{
        occupied.push(pos);
        return pos;
    }
}

var initScene = function(){

    showLoadingScreen('Scene');

    //Welcome Text
    //title
    var welcome_texts = [
        'Wave is an interactive web app',
        'that generates 3D visualizations',
        'of relationships between',
        'Wikipedia articles',
        '(compatible with LeapMotion!!)'
    ];
    var init_pos = new THREE.Vector3(-2,1.0,0);
    welcome_texts.forEach(function(text){
       var text_geo =  geo_TextGeometry(text,0.2);
        text_geo.castShadow = true;
        text_geo.receiveShadow = true;
        var text_obj  = new THREE.Mesh(text_geo,matte_browishgreen);
        all_orientables.add(text_obj);
        setPosition(text_obj,init_pos);
        init_pos = init_pos.add(new THREE.Vector3(0,-0.4,0));
    });

    // create the geometry sphere
    var bg_geo  = new THREE.SphereGeometry(200, 32, 32),
        bg_mat = new THREE.MeshBasicMaterial();
    bg_mat.map   = THREE.ImageUtils.loadTexture('assets/space.jpg');
    bg_mat.side  = THREE.BackSide;
    var bg  = new THREE.Mesh(bg_geo, bg_mat);
    scene.add(bg);

    //Lighting
    var amb_light = new THREE.AmbientLight( 0x404040 ); // soft white light
    var dir_light_warm = new THREE.DirectionalLight( 0xFFECD1, 0.5 );
    dir_light_warm.position.set( 5, 10, 5 );
    dir_light_warm.castShadow = true;
    dir_light_warm.receiveShadow = true;

    var dir_light_cold = new THREE.DirectionalLight( 0xD1EAFF, 1.0 );
    dir_light_cold.position.set( -5, -10, -5 );
    dir_light_cold.castShadow = true;
    dir_light_cold.receiveShadow = true;

    scene.add( dir_light_warm );
    scene.add( dir_light_cold );
    scene.add( amb_light );

    hideLoadingScreen();

};

//Helper functions to turn nodes into 3D objects
var placeNodeInScene = function(node,origin,angle,weight){
    //places node in scene as object
    //returns position of object

    constructed.push(node);

    //new position
    var new_pos = new THREE.Vector3(
        scale*(weight*Math.cos(angle) + origin.x),
        scale*(weight*Math.sin(angle) + origin.y),
        scale*(node.name.getDepth() + origin.z)
    );
    new_pos = checkPosition(new_pos);

    changeLoadingMsg(node.name.title);

    //title
    var node_title_geo = geo_TextGeometry(node.name.title,scale*0.8);
    node_title_geo.castShadow = true;
    node_title_geo.receiveShadow = true;
    var node_title_obj = new THREE.Mesh(node_title_geo,matte_browishgreen);

    //add objects to scene
    all_orientables.add(node_title_obj);

    //set positions
    setPosition(node_title_obj,new_pos);

    return new_pos;
};

var construct_scene_children = function(node,origin,angle,weight){

    var node_pos = placeNodeInScene(node,origin,angle,weight);

    //add line to connect node to parent
    all_connections.add(origin,node_pos);

    var adj = [];
    node.adjList.forEach(function(cur_node){
        if(constructed.indexOf(cur_node) == -1)
            adj.push(cur_node);
    });

    var num_adj = adj.length,
        weights = node.weight,
        angle_offset = 2*Math.PI/num_adj;

    for (var i = 0; i<num_adj; i++)
        construct_scene_children(adj[i],node_pos,angle_offset*i,weights[i]);

};

var construct_scene_parent = function(graph){

    var nodes = graph.getAllNodes(),
        pivot_node = nodes[0];

    var pivot_pos = placeNodeInScene(pivot_node,new THREE.Vector3(0,0,0),0,0);

    //call construct_scene_children on adjs
    var adj = pivot_node.adjList,
        num_adj = adj.length,
        weights = pivot_node.weight,
        angle_offset = 2*Math.PI/num_adj;

    for (var j = 0; j<num_adj; j++)
        construct_scene_children(adj[j],pivot_pos,angle_offset*j,weights[j]);

};

var resetScene = function(){
    all_orientables.reset();
    all_connections.reset();
};

var populateScene = function(items){
    resetScene();
    var graph = getSceneGraph(items);
    construct_scene_parent(graph);
    hideLoadingScreen();
};

//Getting desired title from user
var form = $('#generateTreeForm');
form.keypress(function(e){
    e.stopPropagation();
   if(e.which == 13){
       var value = form.val();
       if(value){
           showLoadingScreen(value);
           getWikiData(value,constructed_limit,populateScene);
       }
   }
});

form.focus(function(){
    allow_key_board = false;
});

form.focusout(function(){
    allow_key_board = true;
});

//

initScene();