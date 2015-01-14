<!DOCTYPE html>
<html>
<?php
/**
 * Created by PhpStorm.
 * User: Jacky
 * Date: 9/9/14
 * Time: 8:21 PM
 */
require_once('head.php');
?>
<body>

    <div class="loading-screen">
        <div class="loading-container">
            <div class="spinner"></div>
            <div class="loading-title">
                Loading
                <span class="loading-msg"></span>
            </div>
        </div>
    </div>

    <div class="info-input-container">
        <input type="text" placeholder="Enter a Wikipedia Article Title Here" id="generateTreeForm">
    </div>

    <div class="settings-container">
        <div class="settings-btn" id="reset">Reset Scene (R)</div>
        <div class="settings-btn" id="origin">Go to Origin (G)</div>
        <div class="settings-btn" id="enableVR">Enable VR Mode (V)</div>
        <div class="settings-btn" id="toggleOrient">Toggle Auto Text Orient (T)</div>
    </div>

    <div class="instructions-container">
        <h1>Instructions:</h1>
        <div class="instructions-block">
            <p>If you don't have a Leap Motion, use following buttons to navigate:</p>
            <p>-Position: WASD : Forward, Leftward, Backward, Rightward</p>
            <p>QE : Upwards, Downwards</p>
            <p>-Rotation: IJKL : Up, Down, Left, Right</p>
            <p>UO : Roll Left, Roll Right</p>
        </div>
        <div class="instructions-block">
            <p>Note: VR support needs Firefox VR or Chromium</p>
        </div>
    </div>

    <script  src="js/controllers/leap_controller.js" type="text/javascript"></script>
    <script  src="js/controllers/keyboard_controller.js" type="text/javascript"></script>
    <script src="js/controllers/three_starter.js" type="text/javascript"></script>
    <script src="js/controllers/oculus_controller.js" type="text/javascript"></script>
    <script  src="js/controllers/three_leap_controller.js" type="text/javascript"></script>
    <script  src="js/scenes/wiki_scene.js" type="text/javascript"></script>
</body>
</html>

