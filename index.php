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


    <script  src="js/controllers/leap_controller.js" type="text/javascript"></script>
    <script  src="js/controllers/keyboard_controller.js" type="text/javascript"></script>
    <script  src="js/controllers/three_leap_controller.js" type="text/javascript"></script>
    <script  src="js/scenes/wiki_scene.js" type="text/javascript"></script>
</body>
</html>

