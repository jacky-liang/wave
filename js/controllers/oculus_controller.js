/**
 * Created by jacky on 1/13/15.
 */
var VR_POSITION_SCALE = 1;
var CAMERA_LEFT_OFFSET = new THREE.Vector3(-0.03281399980187416,0,0);
var CAMERA_RIGHT_OFFSET = new THREE.Vector3(-(CAMERA_LEFT_OFFSET.x),0,0);

function printVector(values) {
    if (values == null)
        return "null";

    var str = "[";

    str += values.x.toFixed(2) + ", ";
    str += values.y.toFixed(2) + ", ";
    str += values.z.toFixed(2);

    if ("w" in values) {
        str += ", " + values.w.toFixed(2);
    }

    str += "]";
    return str;
}

function resize() {
    if (vrMode) {
        camera.aspect = renderTargetWidth / renderTargetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( renderTargetWidth, renderTargetHeight );
    } else {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }
}

//
// WebVR Device initialization
//
var sensorDevice = null;
var hmdDevice = null;
var vrMode = false;
var renderTargetWidth = 1920;
var renderTargetHeight = 1080;

function PerspectiveMatrixFromVRFieldOfView(fov, zNear, zFar) {
    var outMat = new THREE.Matrix4();
    var out = outMat.elements;
    var upTan, downTan, leftTan, rightTan;
    if (fov == null) {
        // If no FOV is given plug in some dummy values
        upTan = Math.tan(50 * Math.PI/180.0);
        downTan = Math.tan(50 * Math.PI/180.0);
        leftTan = Math.tan(45 * Math.PI/180.0);
        rightTan = Math.tan(45 * Math.PI/180.0);
    } else {
        upTan = Math.tan(fov.upDegrees * Math.PI/180.0);
        downTan = Math.tan(fov.downDegrees * Math.PI/180.0);
        leftTan = Math.tan(fov.leftDegrees * Math.PI/180.0);
        rightTan = Math.tan(fov.rightDegrees * Math.PI/180.0);
    }

    var xScale = 2.0 / (leftTan + rightTan);
    var yScale = 2.0 / (upTan + downTan);

    out[0] = xScale;
    out[4] = 0.0;
    out[8] = -((leftTan - rightTan) * xScale * 0.5);
    out[12] = 0.0;

    out[1] = 0.0;
    out[5] = yScale;
    out[9] = ((upTan - downTan) * yScale * 0.5);
    out[13] = 0.0;

    out[2] = 0.0;
    out[6] = 0.0;
    out[10] = zFar / (zNear - zFar);
    out[14] = (zFar * zNear) / (zNear - zFar);

    out[3] = 0.0;
    out[7] = 0.0;
    out[11] = -1.0;
    out[15] = 0.0;

    return outMat;
}

var cameraLeft = new THREE.PerspectiveCamera( 75, 4/3, 0.1, 1000 );
var cameraRight = new THREE.PerspectiveCamera( 75, 4/3, 0.1, 1000 );

var fovScale = 1.0;
function resizeFOV(amount) {
    var fovLeft, fovRight;

    if (!hmdDevice) { return; }

    if (amount != 0 && 'setFieldOfView' in hmdDevice) {
        fovScale += amount;
        if (fovScale < 0.1) { fovScale = 0.1; }

        fovLeft = hmdDevice.getRecommendedEyeFieldOfView("left");
        fovRight = hmdDevice.getRecommendedEyeFieldOfView("right");

        fovLeft.upDegrees *= fovScale;
        fovLeft.downDegrees *= fovScale;
        fovLeft.leftDegrees *= fovScale;
        fovLeft.rightDegrees *= fovScale;

        fovRight.upDegrees *= fovScale;
        fovRight.downDegrees *= fovScale;
        fovRight.leftDegrees *= fovScale;
        fovRight.rightDegrees *= fovScale;

        hmdDevice.setFieldOfView(fovLeft, fovRight);
    }

    if ('getRecommendedEyeRenderRect' in hmdDevice) {
        var leftEyeViewport = hmdDevice.getRecommendedEyeRenderRect("left");
        var rightEyeViewport = hmdDevice.getRecommendedEyeRenderRect("right");
        renderTargetWidth = leftEyeViewport.width + rightEyeViewport.width;
        renderTargetHeight = Math.max(leftEyeViewport.height, rightEyeViewport.height);
        console.log("renderTarget: "+renderTargetWidth+"x"+renderTargetHeight);
    }

    resize();

    if ('getCurrentEyeFieldOfView' in hmdDevice) {
        fovLeft = hmdDevice.getCurrentEyeFieldOfView("left");
        fovRight = hmdDevice.getCurrentEyeFieldOfView("right");
    } else {
        fovLeft = hmdDevice.getRecommendedEyeFieldOfView("left");
        fovRight = hmdDevice.getRecommendedEyeFieldOfView("right");
    }

    cameraLeft.projectionMatrix = PerspectiveMatrixFromVRFieldOfView(fovLeft, 0.1, 1000);
    cameraRight.projectionMatrix = PerspectiveMatrixFromVRFieldOfView(fovRight, 0.1, 1000);
}

function EnumerateVRDevices(devices) {
    // First find an HMD device
    for (var i = 0; i < devices.length; ++i) {
        if (devices[i] instanceof HMDVRDevice) {
            hmdDevice = devices[i];

            var eyeOffsetLeft = hmdDevice.getEyeTranslation("left");
            var eyeOffsetRight = hmdDevice.getEyeTranslation("right");
            console.log("leftTranslation: "+printVector(eyeOffsetLeft));
            console.log("rightTranslation: "+printVector(eyeOffsetRight));

            cameraLeft.position.add(eyeOffsetLeft);
            cameraLeft.position.z = 5;

            cameraRight.position.add(eyeOffsetRight);
            cameraRight.position.z = 5;

            resizeFOV(0.0);
        }
    }

    // Next find a sensor that matches the HMD hardwareUnitId
    for (var i = 0; i < devices.length; ++i) {
        if (devices[i] instanceof PositionSensorVRDevice &&
            (!hmdDevice || devices[i].hardwareUnitId == hmdDevice.hardwareUnitId)) {
            sensorDevice = devices[i];
            console.log("hardware unit id: "+sensorDevice.hardwareUnitId);
            console.log("deviceID: "+sensorDevice.deviceId);
            console.log("deviceName: "+sensorDevice.deviceName);
        }
    }
}

if (navigator.getVRDevices) {
    navigator.getVRDevices().then(EnumerateVRDevices);
} else if (navigator.mozGetVRDevices) {
    navigator.mozGetVRDevices(EnumerateVRDevices);
} else {
    console.log("WebVR API not supported");
}

function updateVRCamera() {
    if (!sensorDevice) return false;
    var vrState = sensorDevice.getState();

    if (vrState.position) {
        setPosition(cameraLeft, camera.position.add(CAMERA_LEFT_OFFSET));
        setPosition(cameraRight, camera.position.add(CAMERA_RIGHT_OFFSET));
    }

    if (vrState.orientation) {
        setQuaternion(camera,vrState.orientation);
        setQuaternion(cameraLeft,camera.quaternion);
        setQuaternion(cameraRight,camera.quaternion);
    }

    return true;
}