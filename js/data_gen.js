/**
 * Created by jacky on 12/28/14.
 */
$.get( "data_gen.php",
    { title: "Philosophy", limit: 20 },
    function(data){
        console.log(data);
    },
    "json");