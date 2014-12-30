/**
 * Created by jacky on 12/27/14.
 */

const scale = 0.7;

//Object Constructors
var geo_BoxGeometry = function(x,y,z){
    return new THREE.BoxGeometry(x,y,z);
};
var geo_CubeGeometry = function(size){
    return geo_BoxGeometry(size,size,size);
};
var geo_TextGeometry = function(text){
    return new THREE.TextGeometry( text, {
        size: 1,
        height: 1.0,
        curveSegments: 6,
        font: "helvetiker",
        weight: "normal",
        style: "normal" });
};

//Materials
var material_green = new THREE.MeshPhongMaterial( { color: 0xD0D45D } );

//array of nodes that have already been constructed
var constructed = [];
//max node construction limit
var constructed_limit = 100;

//Helper functions to turn nodes into 3D objects
var construct_scene_children = function(node,geo,mat,origin,angle,weight){

    //creates geometric representation for all children
    var node_geo = geo(node.name.title);
    node_geo.castShadow = true;
    node_geo.receiveShadow = true;

    //make node object
    constructed.push(node);
    var node_obj = new THREE.Mesh(node_geo,mat);
    all_orientables.add(node_obj);
    node_obj.position.x = scale*(weight*Math.cos(angle) + origin.x);
    node_obj.position.y = scale*(weight*Math.sin(angle) + origin.y);
    node_obj.position.z = scale*(node.name.getDepth() + origin.z);

//    console.log(node.name);

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
            construct_scene_children(adj[i],geo,mat,node_obj.position,angle_offset*i,weights[i]);
        else
            break;
    }
};

var construct_scene_parent = function(graph,geo,mat){
    //only construct new objects if limit not exceeded
    if (constructed.length<constructed_limit){

        //finds node with maximum number of adjs - use as pivot
        var nodes = graph.getAllNodes(),
            node_pivot = nodes[0],
            pivot_length = node_pivot.adjList.length;

        for(var i = 1;i<nodes.length;i++){
            var cur_node = nodes[i];
            if (cur_node.adjList.length > pivot_length){
                node_pivot = cur_node;
                pivot_length = cur_node.adjList.length;
            }
        }

        //make pivot node object
        constructed.push(node_pivot);
        var pivot_geo = geo(node_pivot.name.title);
        pivot_geo.castShadow = true;
        pivot_geo.receiveShadow = true;
        var pivot_obj = new THREE.Mesh(pivot_geo,mat);
        all_orientables.add(pivot_obj);

        //call construct_scene_children on adjs
        var adj = node_pivot.adjList,
            num_adj = adj.length,
            weights = node_pivot.weight,
            angle_offset = 2*Math.PI/node_pivot.adjList.length;

        for (var j = 0; j<num_adj; j++){
            if (constructed.length<constructed_limit)
                construct_scene_children(adj[j],geo,mat,pivot_obj.position,angle_offset*j,weights[j]);
            else
                break;
        }
    }
};


var populateScene = function(items){
    var graph = getSceneGraph(items);
    construct_scene_parent(graph,geo_TextGeometry,material_green);
};

var loadScene = function(title){
    getWikiData(title,20,populateScene);
};

loadScene("Philosophy");


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
