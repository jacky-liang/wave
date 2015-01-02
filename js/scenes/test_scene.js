/**
 * Created by jacky on 12/27/14.
 */

const scale = 1.0;

//Object Constructors
var geo_BoxGeometry = function(x,y,z){
    return new THREE.BoxGeometry(x,y,z);
};
var geo_CubeGeometry = function(size){
    return geo_BoxGeometry(size,size,size);
};
var geo_TextGeometry = function(text,size){
    return new THREE.TextGeometry( text, {
        size: size,
        height: 0.05,
        curveSegments: 6,
        font: "helvetiker",
        weight: "normal",
        style: "normal" });
};
var geo_CynlinderGeometry = function(r_top, r_bot, h, r_seg){
    return new THREE.CylinderGeometry(r_top,r_bot,h,r_seg);
};
var geo_LineGeo = function(from,to){
    var line = new THREE.Geometry();
    line.vertices.push(from);
    line.vertices.push(to);
    return line;
}

//Materials
var matte_browishgreen = new THREE.MeshPhongMaterial( { color: 0xD0D45D } );
var matte_lightblue = new THREE.MeshPhongMaterial( {color: 0x9EEDFF} );
var line_material = new THREE.LineBasicMaterial({color: 0x9EEDFF});

//array of nodes that have already been constructed
var constructed = [];
//max node construction limit
var constructed_limit = 100;

function setPosition(obj,pos){
    obj.position.x = pos.x;
    obj.position.y = pos.y;
    obj.position.z = pos.z;
}

//Helper functions to turn nodes into 3D objects
var placeNodeInScene = function(node,origin,angle,weight){
    //places node in scene as object
    //returns position of object

    //prevent repeats
    constructed.push(node);

    //new position
    var new_pos = new THREE.Vector3(
        scale*(weight*Math.cos(angle) + origin.x),
        scale*(weight*Math.sin(angle) + origin.y),
        scale*(node.name.getDepth() + origin.z)
    );

    console.log('constructing '+node.name.title);

    //title
    var node_title_geo = geo_TextGeometry(node.name.title,0.8);
    node_title_geo.castShadow = true;
    node_title_geo.receiveShadow = true;
    var node_title_obj = new THREE.Mesh(node_title_geo,matte_browishgreen);

    //picture
    //TODO: not working
    var pic_texture = THREE.ImageUtils.loadTexture(node.name.pic),
        pic_material = new THREE.MeshLambertMaterial({ map : pic_texture }),
        pic_plane_geo = new THREE.PlaneGeometry(2, 4),
        pic_plane_obj = new THREE.Mesh(pic_plane_geo, pic_material);
    pic_plane_obj.material.side = THREE.DoubleSide;

    //add objects to scene
    all_orientables.add(node_title_obj);

    //set positions
    setPosition(node_title_obj,new_pos);
    setPosition(pic_plane_obj,new_pos);

    return new_pos;
};

var construct_scene_children = function(node,origin,angle,weight){

    var node_pos = placeNodeInScene(node,origin,angle,weight);

    //add line to connect node to parent
    scene.add(new THREE.Line(geo_LineGeo(origin,node_pos),line_material,THREE.LineStrip));

    //only constructs if node object doesn't already exist
    var adj = [];
    node.adjList.forEach(function(cur_node){
       if (constructed.indexOf(cur_node) == -1)
        adj.push(cur_node);
    });

    var num_adj = adj.length,
        weights = node.weight,
        angle_offset = 2*Math.PI/node.adjList.length;

    for (var i = 0; i<num_adj; i++){
        if (constructed.length<constructed_limit)
            construct_scene_children(adj[i],node_pos,angle_offset*i,weights[i]);
        else
            break;
    }
};

var construct_scene_parent = function(graph){
    //only construct new objects if limit not exceeded
    if (constructed.length<constructed_limit){

        var nodes = graph.getAllNodes(),
            pivot_node = nodes[0];

        var pivot_pos = placeNodeInScene(pivot_node,new THREE.Vector3(0,0,0),0,0);

        //call construct_scene_children on adjs
        var adj = pivot_node.adjList,
            num_adj = adj.length,
            weights = pivot_node.weight,
            angle_offset = 2*Math.PI/pivot_node.adjList.length;

        for (var j = 0; j<num_adj; j++){
            if (constructed.length<constructed_limit)
                construct_scene_children(adj[j],pivot_pos,angle_offset*j,weights[j]);
            else
                break;
        }
    }
};


var populateScene = function(items){
    var graph = getSceneGraph(items);
    construct_scene_parent(graph);
};

var loadScene = function(title,limit){
    getWikiData(title,limit,populateScene);
};

loadScene("Philosophy",10);

//other objects in scene
// create the geometry sphere
geometry  = new THREE.SphereGeometry(200, 32, 32);
// create the material, using a texture of startfield
material  = new THREE.MeshBasicMaterial();
material.map   = THREE.ImageUtils.loadTexture('assets/space.jpg');
material.side  = THREE.BackSide;
// create the mesh based on geometry and material
var bg  = new THREE.Mesh(geometry, material);
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