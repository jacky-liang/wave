/**
 * Created by Jacky on 9/10/14.
 * Use for LEAP Debug Purposes
 */
$(document).ready(function(){

    function concatData(id, data){
        return id+": "+data;
    }

    var frameString = "";

    var options = { enableGestures: true };

    //Constants

    var pitch, yaw, roll, height, depth = 0;

    var p = $("#pitch");
    var y = $("#yaw");
    var r = $("#roll");
    var h = $("#height");
    var d = $("#depth");

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

        if(val<min)
            return 0;
        if(val>max)
            return 1;
        return 1/(max-min)*(val-min);
    };


    //Main Loop
    Leap.loop(options, function(frame){

        frameString = concatData('frame_id', frame.id);
        if(frame.hands.length >0){

            var hand = frame.hands[0];

            pitch =hand.pitch();
            yaw = hand.yaw();
            roll = hand.roll();
            height = hand.palmPosition[1];
            depth = hand.palmPosition[2];

            frameString += concatData('height',height);
            frameString += concatData('depth',depth);

            /*
            frameString += concatData('pitch', pitch);
            frameString += concatData('yaw', yaw);
            frameString += concatData('roll', roll);
            */

            var heightThreshold = passThreshold(height_low,height_high,height);
            if(heightThreshold == 1)
                h.html('going up: '+getMultiplier(height_high,height_high_max,height));
            else if(heightThreshold == -1)
                h.html('going down: '+getMultiplier(height_low,height_low_max,height));
            else if(heightThreshold == 0)
                h.html('height neutral: ');

            var depthThreshold = passThreshold(depth_low,depth_high,depth);
            if(depthThreshold == 1)
                d.html('going back: '+getMultiplier(depth_high,depth_high_max,depth));
            else if(depthThreshold == -1)
                d.html('going forward: '+getMultiplier(depth_low,depth_low_max,depth));
            else if(depthThreshold == 0)
                d.html('depth neutral: ');

            var pitchThreshold =passThreshold(pitch_low,pitch_high,pitch);
            if(pitchThreshold == 1)
                p.html('look up: '+getMultiplier(pitch_high,pitch_high_max,pitch));
            else if(pitchThreshold == -1)
                p.html('look down: '+getMultiplier(pitch_low,pitch_low_max,pitch));
            else if(pitchThreshold == 0)
                p.html('pitch neutral: ');

            var yawThreshold = passThreshold(yaw_low,yaw_high,yaw);
            if(yawThreshold == 1)
                y.html('look right: '+getMultiplier(yaw_high,yaw_high_max,yaw));
            else if(yawThreshold == -1)
                y.html('look left: '+getMultiplier(yaw_low,yaw_low_max,yaw));
            else if(yawThreshold == 0)
                y.html('yaw neutral: ');

            var rollThreshold = passThreshold(roll_low,roll_high,roll);
            if(rollThreshold == 1)
                r.html('look left: '+getMultiplier(roll_high,roll_high_max,roll));
            else if(rollThreshold == -1)
                r.html('look right: '+getMultiplier(roll_low,roll_low_max,roll));
            else if(rollThreshold == 0)
                r.html('roll neutral: ');

        }
        else{
            p.html('');
            y.html('');
            r.html('');
            h.html('');
        }

        console.log(frameString);

        if(frame.valid){


        }

    });
});
