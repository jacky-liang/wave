/**
 * Created by Jacky on 9/13/14.
 */
//NEED LEAP_CONTROLLER.JS

//Scene Construction
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 0.1, 1000 );

//Keeps track of all objects in scene that needs to face the camera
function Orientable(scene){
    this.objects = [];
    this.scene = scene;

    //orients all objects according to camera rotation. called every frame
    this.orient = function orient(camera){
        this.objects.forEach(function(obj){
            obj.quaternion.copy(camera.quaternion);
        });
    };

    //adds object to tracking list and also scene
    this.add = function add(obj){
        this.objects.push(obj);
        this.scene.add(obj);
    }
}
//the only orientable instance that needs to be used
var all_orientables = new Orientable(scene);

//Append Renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMapEnabled = true;
$(document.body).append( renderer.domElement );

//Set Camera
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
    if(look_left_y >= 0)
        camera.rotateY(0.03*look_left_y);
    if(look_right_y >=0)
        camera.rotateY(-0.03*look_right_y);

    //Turn left/right
    if(turn_left_r >= 0)
        camera.rotateZ(0.03*turn_left_r);
    if(turn_right_r >=0)
        camera.rotateZ(-0.03*turn_right_r);

    all_orientables.orient(camera);

    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
render();