/**
 * Created by jacky on 12/28/14.
 */
function enableLoading(title){
    console.log('loading '+title);
}

function getWikiData(title,limit,fn){
    enableLoading(title);
    $.get( "data_gen.php",
        { title: title, limit: limit },
        fn,
        "json");
}