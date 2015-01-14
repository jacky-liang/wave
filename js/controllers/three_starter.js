/**
 * Created by jacky on 1/13/15.
 */

//Basic Three.js Setup
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();

renderer.setClearColor(0x202020, 1.0);
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMapEnabled = true;

//Custom Three.js Helper Code

function setPosition(obj,pos){
    obj.position.x = pos.x;
    obj.position.y = pos.y;
    obj.position.z = pos.z;
}

function setQuaternion(obj,quat){
    obj.quaternion.x = quat.x;
    obj.quaternion.y = quat.y;
    obj.quaternion.z = quat.z;
    obj.quaternion.w = quat.w;
}