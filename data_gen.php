<?php
/**
 * Created by PhpStorm.
 * User: jacky
 * Date: 12/28/14
 * Time: 8:02 PM
 */

//GET Params
$pivot_title = $_GET["title"];
$limit = $_GET["limit"];

//Helper Functions

function fetchFromWikipedia($title){
    //get raw json from wikipedia page w/ title name
    $url = 'http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page='.$title;
    $ch = curl_init($url);
    curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt ($ch, CURLOPT_USERAGENT, "Wave"); // required by wikipedia.org server; use YOUR user agent with YOUR contact information. (otherwise your IP might get blocked)
    $c = curl_exec($ch);

    return $c;
}

function constructItemArray($title,$content,$pic){
    //construct item data abstraction.
    //this is NOT an exact representation of the js version b/c of its tree structure. js will convert it to graph accordingly
    return array(
      "title" => $title,
        "pic" => $pic,
        "content" => $content,
        "children" => array()
    );
}

//these parse functions assume the pattern exists. it is a fairly reasonable assumption
function parse($raw,$pattern,$fn){
    if(preg_match($pattern, $raw, $matches))
        return $fn($matches);
}

function getFirstParagraph($raw){
    $pattern_first_p = '#<p>(.*)</p>#Us';
    return parse($raw,$pattern_first_p,function($matches){
        $raw_first_p = $matches[1];
        return $raw_first_p;
    });
}

function getPictureLink($raw){
    $pattern_pic_link = '#<img .* src="(.*)" width=#';
    return parse($raw,$pattern_pic_link,function($matches){
        $first_pic_link = $matches[1];
        return $first_pic_link;
    });
}

function getTitles($raw){
    //<a href="/wiki/Violence" title="Violence">violence</a>
    $pattern_titles = '#<a href=.* title=.*">(.*)</a>#';
    return parse($raw,$pattern_titles,function($matches){
        return $matches;
    });

}

$json = json_decode(fetchFromWikipedia($pivot_title));
$raw = $json->{'parse'}->{'text'}->{'*'};

$doc = new DOMDocument();
$doc->loadHTML($raw);

$content = $doc->getElementsByTagName('p')->item(0)->nodeValue;

$pic = getPictureLink($raw);
$titles = getTitles($first_p);



/*
 * result format:
 * (item format:
 *  title
 *  link to picture
 *  first paragraph
 *  array of child items)
 * parent item
 *
 */
