<?php
/**
 * Created by PhpStorm.
 * User: jacky
 * Date: 12/29/14
 * Time: 10:55 PM
 */
require_once('simple_html_dom.php');

function fetchFromWikipedia($title){
    //get raw json from wikipedia page w/ title name
    $url = 'http://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&section=0&page='.$title;
    $ch = curl_init($url);
    curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt ($ch, CURLOPT_USERAGENT, "Wave"); // required by wikipedia.org server; use YOUR user agent with YOUR contact information. (otherwise your IP might get blocked)
    $c = curl_exec($ch);

    return $c;
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
        $json = json_decode(fetchFromWikipedia($plain_title));

        if(property_exists($json,'error'))
            return false;

        $raw = $json->{'parse'}->{'text'}->{'*'};

        //make dom object
        $html = str_get_html($raw);
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
            if(Title::is_valid($cur_url))
                array_push($titles,new Title($cur_title,$cur_url));
        }

        return new Item($plain_title,$content,$pic,$titles);
    }
}

class Title{

    public static $parsed_url = array();

    public function Title($title, $url){
        $this->title = $title;
        $this->url = $url;
        $this->title_url = $this->get_title_url($url);
        array_push(self::$parsed_url,$url);
        return true;
    }

    public function get_title_url($url){
        preg_match('#wiki\/(.*)#',
            $url, $matches);
        return $matches[1];
    }

    public static function is_valid($url){
        if( !in_array($url,self::$parsed_url))
            return true;
        else
            return false;
    }
}