/**
 * Created by jacky on 12/28/14.
 * Interface for data transmission between frontend and backend
 */
function getWikiData(title,limit,fn){
    console.log('limit to '+limit);
    $.get( "data_gen.php",
        { title: title, limit: limit },
        fn,
        "json");
}