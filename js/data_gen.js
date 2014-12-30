/**
 * Created by jacky on 12/28/14.
 */
function enableLoading(title){
    console.log('loading '+title);
}

function getTreeData(title,limit,fn){
    $.get( "data_gen.php",
        { title: title, limit: limit },
        fn,
        "json");
}

function getWikiData(title,limit){
    enableLoading(title);
    getTreeData(title,limit,function(data){
        console.log(data);
    })
}

getWikiData('Barack Obama',30);