<?php
/**
 * Created by PhpStorm.
 * User: jacky
 * Date: 12/29/14
 * Time: 10:55 PM
 * Function: Item Data Abstraction and Data Retrieval from Wikipedia
 */
require_once('assets/simple_html_dom.php');

function fetchFromWikipedia($url){
    //get raw json from wikipedia page w/ given url
    $ch = curl_init($url);
    curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt ($ch, CURLOPT_USERAGENT, "Wave");
    $c = curl_exec($ch);

    return $c;
}

function fetchFromWikipediaByTitle($title){
    $url = 'http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page='.urlencode($title);
    return fetchFromWikipedia($url);
}

class Item {
    public function Item($title, $content, $pic, $titles){
        $this->title = $title;
        $this->content = $content;
        $this->pic = $pic;
        $this->child_titles = $titles;
        $this->num_children = sizeof($titles);
        $this->n = 0;
        $this->child_items = array();
    }

    //"breadth first" lazily item generator
    public function generateNewItem(){
        if($this->num_children > 0){
            if($this->n >= $this->num_children)
                $this->child_items[$this->n % $this->num_children]->generateNewItem();
            else{
                $new_item = Item::constructAnItem($this->child_titles[$this->n]->title_url);
                if($new_item)
                    array_push($this->child_items,$new_item);
            }
            $this->n++;
        }
    }

    public static function constructAnItem($plain_title){

        //get raw json
        $json = json_decode(fetchFromWikipediaByTitle($plain_title));

        if(property_exists($json,'error'))
            return false;

        $raw = $json->{'parse'}->{'text'}->{'*'};
        $html = str_get_html($raw);

        //check if this is a redirect, if so, get proper title
        if(strpos($raw,'redirectMsg') !== false){
            preg_match('#index.php\?title=(.*)&#',
                $raw, $matches);
            return Item::constructAnItem($matches[1]);
        }

        if(sizeof(Title::$parsed_titles) == 0)
            Title::includeTitle($plain_title);

        //make dom object
        $first_p = $html->find('p',0);

        //get relevant info
        //content
        $content = $first_p->plaintext;
        //picture url
        $pic = '';
        if($html->find('img',0))
            $pic = $html->find('img',0)->src;
        //children titles in first paragraph
        $titles = array();
        $raw_titles =$first_p->find('a');
        foreach($raw_titles as $raw_title){
            $raw_title_attr = $raw_title->attr;
            if(!array_key_exists('title',$raw_title_attr))
                continue;
            $cur_url = $raw_title_attr['href'];
            $cur_title = $raw_title_attr['title'];
            if(Title::is_valid($cur_url,$cur_title))
                array_push($titles,new Title($cur_title,$cur_url));
        }

        return new Item($plain_title,$content,$pic,$titles);
    }
}

class Title{

    public static $parsed_titles = array();

    public static function includeTitle($title){
        array_push(self::$parsed_titles,strtolower($title));
    }

    public function Title($title, $url){
        $this->title = $title;
        $this->url = $url;
        $this->title_url = $this->get_title_url($url);
        self::includeTitle($title);
        return true;
    }

    public function get_title_url($url){
        preg_match('#wiki\/(.*)#',
            $url, $matches);
        return $matches[1];
    }

    public static function is_valid($url,$title){
        if( strpos($url,'Help:') == false &&
            !in_array(strtolower($title),self::$parsed_titles))
            return true;
        else
            return false;
    }
}