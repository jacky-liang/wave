<?php
/**
 * Created by PhpStorm.
 * User: jacky
 * Date: 12/28/14
 * Time: 8:02 PM
 * Function: Interface between backend and frontend
 */

require_once('data_gen_classes.php');

$pivot_title = $_GET["title"];
$limit = $_GET["limit"];

$item = Item::constructAnItem($pivot_title);
if($item){
    for($i = 0;$i<$limit;$i++)
        $item->generateNewItem();
    echo json_encode($item);
}
else
    http_response_code(404);