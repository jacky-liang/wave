/**
 * Created by Jacky on 9/13/14.
 */


    function concatData(id, data){
        return id+": "+data;
    }

    var frameString = "";

    var options = { enableGestures: true };

    //Constants

    var pitch, yaw, roll, height, depth = 0;

    var go_forward, go_backward, go_up, go_down, look_left_y, look_right_y, look_left_r, look_right_r, look_up, look_down = 0;

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

    var depth_low = 0;
    var depth_low_max = -80;
    var depth_high = 40;
    var depth_high_max = 170;

    //Helper Functions

    var passThreshold = function(low, high, val){
        if(val<low)
            return -1;
        else if(val>high)
            return 1;
        return 0;
    };

    var getMultiplier = function(min, max, val){

        val = Math.abs(val);
        min = Math.abs(min);
        max = Math.abs(max);

        if(min>max){

            if(val>min)
                return 0;
            if(val<max)
                return 1;
            return -1/(max-min)*(min-val);
        }


        if(val>max)
            return 1;
        return 1/(max-min)*(val-min);
    };


    //Main Loop
    Leap.loop(options, function(frame){

        if(frame.hands.length >0){

            var hand = frame.hands[0];

            pitch =hand.pitch();
            yaw = hand.yaw();
            roll = hand.roll();
            height = hand.palmPosition[1];
            depth = hand.palmPosition[2];

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

            var depthThreshold = passThreshold(depth_low,depth_high,depth);
            if(depthThreshold == 1){
                go_backward = getMultiplier(depth_high,depth_high_max,depth);
                go_forward = 0;
            }
            else if(depthThreshold == -1){
                go_forward = getMultiplier(depth_low,depth_low_max,depth);
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
            go_forward = go_backward = go_up = go_down = look_left_y = look_right_y = look_right_r = look_left_r = look_up = look_down = 0;
        }

    });
