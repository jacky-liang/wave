/**
 * Created by jacky on 12/27/14.
 */

const scale = 0.7;

//Create data graph data structure
var data = new Graph(),
    A = data.addNode(new Item('A',0)),
    B = data.addNode(new Item('B',1)),
    C = data.addNode(new Item('C',2));
A.addEdge(B,5);
A.addEdge(C,10);
B.addEdge(C,30);

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
var material_green = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );

//Helper functions to turn nodes into 3D objects
var construct_scene_children = function(node,geo,mat,origin,angle,weight){
    //creates geometric representation for all children
    var node_geo = geo(node.name.title);
    node_geo.castShadow = true;
    node_geo.receiveShadow = true;

    var node_obj = new THREE.Mesh(node_geo,mat);
    scene.add(node_obj);
    node_obj.position.x = scale*(weight*Math.cos(angle) + origin.x);
    node_obj.position.y = scale*(weight*Math.sin(angle) + origin.y);
    //TODO: set z position

    //recursively call construct_scene_children on adj
};

var construct_scene_parent = function(graph,geo,mat){
    //finds node with maximum number of adjs - use as pivot
    //call construct_scene_children on adjs

    var nodes = graph.getAllNodes(),
        node_pivot = nodes[0],
        pivot_length = node_pivot.adjList.length;

    for(var i = 1;i<nodes.length;i++){
        var cur_node = nodes[i];
        if (cur_node.adjList.length > pivot_length)
            node_pivot = cur_node
    }

    var pivot_geo = geo(node_pivot.name.title);
    pivot_geo.castShadow = true;
    pivot_geo.receiveShadow = true;
    var pivot_obj = new THREE.Mesh(pivot_geo,mat);
    scene.add(pivot_obj);

    var adj = node_pivot.adjList,
        num_adj = adj.length,
        weights = node_pivot.weight,
        angle_offset = 2*Math.PI/node_pivot.adjList.length;

    for (var i = 0; i<num_adj; i++){
      construct_scene_children(adj[i],geo,mat,pivot_obj.position,angle_offset*i,weights[i]);
    }

};

//Establish pivot node and construct the rest
construct_scene_parent(data,geo_TextGeometry,material_green);

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
var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
directionalLight.position.set( 5, 10, 5 );
directionalLight.castShadow = true;
directionalLight.receiveShadow = true;
scene.add( directionalLight );
scene.add( amb_light );

render();

