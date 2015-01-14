/**
 * Created by Jacky on 9/13/14.
 * Use Constants Provided by Leap Controller to control Three.js camera navigation
 */
//NEED LEAP_CONTROLLER.JS

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
    };

    this.reset = function reset(){
      this.objects.forEach(function(object){
         this.scene.remove(object);
      });
      this.objects = [];
    };
}

function Connections(scene){
    //list of line objects
    this.connections = [];
    this.scene = scene;
    this.line_material = new THREE.LineBasicMaterial({color: 0x9EEDFF});

    this.add = function add(from,to){
        var line = new THREE.Geometry();
        line.vertices.push(from);
        line.vertices.push(to);

        var connection = new THREE.Line(line,this.line_material,THREE.LineStrip);
        this.connections.push(connection);
        scene.add(connection);
    };

    this.reset = function reset(){
      this.connections.forEach(function(connection){
          this.scene.remove(connection);
      });
        this.connections = [];
    }
}

var allow_orient = true;
function toggleOrient(){
    allow_orient = !allow_orient;
}

//the only orientable instance that needs to be used
var all_orientables = new Orientable(scene);
var all_connections = new Connections(scene);

//Oculus Integration
resize();
window.addEventListener("resize", resize, false);

renderer.domElement.addEventListener("touchstart", function(ev) {
    if (sensorDevice)
        sensorDevice.zeroSensor();
});

$(document.body).append( renderer.domElement );

// Fullscreen VR mode handling
function onFullscreenChange() {
    if(!document.webkitFullscreenElement && !document.mozFullScreenElement) {
        vrMode = false;
    }
    resize();
}

document.addEventListener("webkitfullscreenchange", onFullscreenChange, false);
document.addEventListener("mozfullscreenchange", onFullscreenChange, false);

var vrBtn = document.getElementById("vrBtn");
if (vrBtn) {
    vrBtn.addEventListener("click", function() {
        vrMode = true;
        resize();
        if (renderer.domElement.webkitRequestFullscreen) {
            renderer.domElement.webkitRequestFullscreen({ vrDisplay: hmdDevice });
        } else if (renderer.domElement.mozRequestFullScreen) {
            renderer.domElement.mozRequestFullScreen({ vrDisplay: hmdDevice });
        }
    }, false);
}

window.addEventListener("vrdeviceactivated", function(ev) {
    renderer.setClearColor(0x600000, 1.0);
});

window.addEventListener("vrdevicedeactivated", function(ev) {
    renderer.setClearColor(0x202020, 1.0);
});

//Set Camera
camera.position.z = 5;

function render() {

    if(allow_orient)
        all_orientables.orient(camera);

    //Displacement Control for Leap
    //Along viewing angle
    if(go_forward || key_pressed.w)
        camera.translateZ(-0.1*go_forward);
    if(go_backward >= 0 || key_pressed.s)
        camera.translateZ(0.1*go_backward);
    //Elevation
    if(go_up)
        camera.translateY(0.1*go_up);
    if(go_down)
        camera.translateY(-0.1*go_down);
    //Dolly
    if(dolly_left)
        camera.translateX(-0.1*dolly_left);
    if(dolly_right)
        camera.translateX(0.1*dolly_right);

    //Displacement Control for Keyboard
    const speed = 0.5;
    //Along viewing angle
    if(key_pressed.w)
        camera.translateZ(-0.1*speed);
    if(key_pressed.s)
        camera.translateZ(0.1*speed);
    //Elevation
    if(key_pressed.e)
        camera.translateY(0.1*speed);
    if(key_pressed.q)
        camera.translateY(-0.1*speed);
    //Dolly
    if(key_pressed.a)
        camera.translateX(-0.1*speed);
    if(key_pressed.d)
        camera.translateX(0.1*speed);

    requestAnimationFrame(render);

    if (vrMode) {

        updateVRCamera();

        // Render left eye
        renderer.enableScissorTest ( true );
        renderer.setScissor( 0, 0, renderTargetWidth / 2, renderTargetHeight );
        renderer.setViewport( 0, 0, renderTargetWidth / 2, renderTargetHeight );
        renderer.render(scene, cameraLeft);

        // Render right eye
        renderer.setScissor( renderTargetWidth / 2, 0, renderTargetWidth / 2, renderTargetHeight );
        renderer.setViewport( renderTargetWidth / 2, 0, renderTargetWidth / 2, renderTargetHeight );
        renderer.render(scene, cameraRight);
    } else {

        //Rotation Control for Leap
        //Rotate up/down
        if(look_up)
            camera.rotateX(0.03*look_up);
        if(look_down)
            camera.rotateX(-0.03*look_down);

        //Rotate left/right
        if(look_left_y)
            camera.rotateY(0.03*look_left_y);
        if(look_right_y)
            camera.rotateY(-0.03*look_right_y);
        //Turn left/right
        if(turn_left_r)
            camera.rotateZ(0.03*turn_left_r);
        if(turn_right_r)
            camera.rotateZ(-0.03*turn_right_r);

        //Rotation Control for Keyboard
        //Rotate up/down
        if(key_pressed.i)
            camera.rotateX(0.03*speed);
        if(key_pressed.k)
            camera.rotateX(-0.03*speed);
        //Rotate left/right
        if(key_pressed.j)
            camera.rotateY(0.03*speed);
        if(key_pressed.l)
            camera.rotateY(-0.03*speed);
        //Turn left/right
        if(key_pressed.u)
            camera.rotateZ(0.03*speed);
        if(key_pressed.o)
            camera.rotateZ(-0.03*speed);

        // Render Single Camera
        renderer.enableScissorTest ( false );
        renderer.setViewport( 0, 0, window.innerWidth, window.innerHeight );
        renderer.render(scene, camera);
    }

}
render();