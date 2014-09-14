/**
 * Created by Jacky on 9/13/14.
 */
    var options = { enableGestures: true };

    //Constants

    var pitch, yaw, roll, height, depth = 0;

    var go_forward, go_backward, go_up, go_down, look_left_y, look_right_y, look_left_r, look_right_r, look_up, look_down, dolly_left, dolly_right = 0;

    var pitch_low = 0.1;
    var pitch_high = 0.5;
    var pitch_low_max = -0.9;
    var pitch_high_max = 1.0;

    var yaw_low = -0.2;
    var yaw_high = 0.2;
    var yaw_low_max = -1.0;
    var yaw_high_max = 1.0;

    var roll_high = 0.1;
    var roll_low =-0.2;
    var roll_low_max = -1.5;
    var roll_high_max = 0.9;

    var height_low = 150;
    var height_high = 170;
    var height_low_max = 40;
    var height_high_max = 280;

    var depth_low = 60;
    var depth_low_max = -50;
    var depth_high = 70;
    var depth_high_max = 200;

    var horiz_low = -30;
    var horiz_low_max = -180;
    var horiz_high = 30;
    var horiz_high_max = 180;

    //Helper Functions

    var passThreshold = function(low, high, val){
        if(val<low)
            return -1;
        else if(val>high)
            return 1;
        return 0;
    };

    var getMultiplier = function(min, max, val){
        return Math.abs(1/(max-min)*(val-min));
    };

    //Main Loop
    Leap.loop(options, function(frame){

        if(frame.hands.length >0 && frame.hands[0].grabStrength < 0.9){

            var hand = frame.hands[0];

            pitch =hand.pitch();
            yaw = hand.yaw();
            roll = hand.roll();
            height = hand.palmPosition[1];
            depth = hand.palmPosition[2];
            horiz = hand.palmPosition[0];

            console.log('horiz: '+horiz);

            var heightThreshold = passThreshold(height_low,height_high,height);
            if(heightThreshold == 1){
                go_up = getMultiplier(height_high,height_high_max,height);
                go_down = 0;
            }
            else if(heightThreshold == -1){
                go_down= getMultiplier(height_low,height_low_max,height);
                go_up = 0;
            }
            else if(heightThreshold == 0)
                go_up = go_down = 0;

            var horizThreshold = passThreshold(horiz_low,horiz_high,horiz);
            if(horizThreshold == 1){
                dolly_right = getMultiplier(horiz_low,horiz_low_max,horiz);
                dolly_left = 0;
            }
            else if(horizThreshold == -1){
                dolly_left= getMultiplier(horiz_high,horiz_high_max,horiz);
                dolly_right = 0;
            }
            else if(heightThreshold == 0)
                dolly_left = dolly_right = 0;



            var depthThreshold = passThreshold(depth_low,depth_high,depth);
            if(depthThreshold == 1){
                go_backward = getMultiplier(depth_high,depth_high_max,depth);
                go_forward = 0;
            }
            else if(depthThreshold == -1){
                go_forward = getMultiplier(depth_low,depth_low_max,depth);
                console.log('going forward: '+go_forward);
                go_backward = 0;
            }
            else if(depthThreshold == 0)
                go_forward = go_backward =0;

            var pitchThreshold =passThreshold(pitch_low,pitch_high,pitch);
            if(pitchThreshold == 1){
                look_up = getMultiplier(pitch_high,pitch_high_max,pitch);
                look_down = 0;
            }
            else if(pitchThreshold == -1){
                look_down = getMultiplier(pitch_low,pitch_low_max,pitch);
                look_up = 0;
            }
            else if(pitchThreshold == 0)
                look_down = look_up = 0;

            var yawThreshold = passThreshold(yaw_low,yaw_high,yaw);
            if(yawThreshold == 1)
                look_right_y = getMultiplier(yaw_high,yaw_high_max,yaw);
            else if(yawThreshold == -1)
                look_left_y = getMultiplier(yaw_low,yaw_low_max,yaw);
            else if(yawThreshold == 0)
                look_left_y = look_right_y = 0;

            var rollThreshold = passThreshold(roll_low,roll_high,roll);
            if(rollThreshold == 1)
                look_left_r = getMultiplier(roll_high,roll_high_max,roll);
            else if(rollThreshold == -1)
                look_right_r = getMultiplier(roll_low,roll_low_max,roll);
            else if(rollThreshold == 0)
                look_right_r = look_left_r = 0;

        }
        else{
            go_forward = go_backward = go_up = go_down = look_left_y = look_right_y = look_right_r = look_left_r = look_up = look_down = dolly_left = dolly_right = 0;
        }

    });
