/**
 * Created by Jacky on 9/13/14.
 * Generate Actionable Navigation Constants that can be used by any rendering script
 */
    //Enable Leap integration
    var options = { enableGestures: true };

    //Stores data from leap
    var pitch, yaw, roll, height, depth;

    //Constants that can be used to direct navigation. Updated per frame
    var go_forward = go_backward = go_up = go_down = look_left_y = look_right_y = turn_left_r = turn_right_r = look_up = look_down = dolly_left = dolly_right = 0;

    //Decay constants to "simulate" inertia
    var translational_decay = 0.92;
    var rotational_decay = 0.95;

    //Threshold Values. Please adjust with care.
    var pitch_low = 0.3;
    var pitch_high = 0.3;
    var pitch_low_max = -0.9;
    var pitch_high_max = 1.0;

    var yaw_low = 0;
    var yaw_high = 0;
    var yaw_low_max = -1.0;
    var yaw_high_max = 1.0;

    var roll_high = -.05;
    var roll_low =-.05;
    var roll_low_max = -1.5;
    var roll_high_max = 0.9;

    var height_low = 160;
    var height_high = 160;
    var height_low_max = 40;
    var height_high_max = 280;

    var depth_low = 65;
    var depth_low_max = -50;
    var depth_high = 65;
    var depth_high_max = 200;

    var horiz_low = 0;
    var horiz_low_max = -180;
    var horiz_high = 0;
    var horiz_high_max = 180;

    //Helper Functions
    var passThreshold = function(low, high, val){
        if(val<low)
            return -1;
        else if(val>high)
            return 1;
        return 0;
    };

    var decay = function(val,m){
        if(val<0.0001)
            return 0;
        return val*m;
    };

    //Main Loop
    Leap.loop(options, function(frame){

        //Only uses data from the first hand
        if(frame.hands.length >0 && frame.hands[0].pinchStrength < 0.95){

            //Changes navigation variables

            var hand = frame.hands[0];
            var pinch_strength = frame.hands[0].pinchStrength;

            var getMultiplier = function(min, max, val){
                return Math.abs(1/(max-min)*(val-min))*(1-pinch_strength);
            };

            pitch =hand.pitch();
            yaw = hand.yaw();
            roll = hand.roll();
            height = hand.palmPosition[1];
            depth = hand.palmPosition[2];
            horiz = hand.palmPosition[0];

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
                turn_left_r = getMultiplier(roll_high,roll_high_max,roll);
            else if(rollThreshold == -1)
                turn_right_r = getMultiplier(roll_low,roll_low_max,roll);
            else if(rollThreshold == 0)
                turn_right_r = turn_left_r = 0;

        }
        else{

            //initiate decay in the absence of hands
            go_forward = decay(go_forward,translational_decay);
            go_backward = decay(go_backward,translational_decay);
            go_up = decay(go_up,translational_decay);
            go_down = decay(go_down,translational_decay);
            look_left_y = decay(look_left_y,rotational_decay);
            look_right_y = decay(look_right_y,rotational_decay);
            turn_right_r = decay(turn_right_r,rotational_decay);
            turn_left_r = decay(turn_left_r,rotational_decay);
            look_up = decay(look_up,rotational_decay);
            look_down = decay(look_down,rotational_decay);
            dolly_left = decay(dolly_left,translational_decay);
            dolly_right = decay(dolly_right,translational_decay);

        }

    });
