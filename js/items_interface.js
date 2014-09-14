/**
 * Created by Jacky on 9/13/14.
 */
//Load Three.js


//Scene Construction
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );

//Append Renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMapEnabled = true;
$(document.body).append( renderer.domElement );

//Construct Test Cube
var geometry = new THREE.BoxGeometry(1,1,1);
var material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
cube.castShadow = true;
cube.receiveShadow = true;
scene.add( cube );

// create the geometry sphere
geometry  = new THREE.SphereGeometry(200, 32, 32);
// create the material, using a texture of startfield
material  = new THREE.MeshBasicMaterial();
material.map   = THREE.ImageUtils.loadTexture('assets/bg/nebula.png');
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



camera.position.z = 5;

function render() {

    //Along viewing angle
    if(go_forward >= 0)
        camera.translateZ(-0.1*go_forward);
    if(go_backward >= 0)
        camera.translateZ(0.1*go_backward);

    //Elevation
    if(go_up >= 0)
        camera.translateY(0.1*go_up);
    if(go_down >= 0)
        camera.translateY(-0.1*go_down);

    //Dolly
    if(dolly_left >= 0)
        camera.translateX(-0.1*dolly_left);
    if(dolly_right >=0)
        camera.translateX(0.1*dolly_right);

    //Rotate up/down
    if(look_up >=0)
        camera.rotateX(0.03*look_up);
    if(look_down >= 0)
        camera.rotateX(-0.03*look_down);

    //Rotate left/right
    if(look_left_r >= 0 || look_left_y >= 0)
        camera.rotateY(0.03*Math.max(look_left_r,look_left_y));
    if(look_right_r >=0 || look_right_y >=0)
        camera.rotateY(-0.03*Math.max(look_right_r,look_right_y));

    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
render();