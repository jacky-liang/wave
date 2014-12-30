/**
 * Created by jacky on 12/28/14.
 */
//Item class
function Item(title,content,pic,depth){
    this.title = title;
    this.content = content;
    this.pic = pic;
    this.depth = depth;
    this.getDepth = function(){
        return this.depth*4;
    }
}

function generateAnItem(item,graph,depth){
    return graph.addNode(new Item(item.title,item.content,item.pic,depth));
}

function generateChildItems(node,item,graph){
    /*for every child item in item:
    *   generate child node
    *   connect edges
    *   call generate childitems on child node and child item
    */
    item.child_items.forEach(function(child_item){
       var child_node = generateAnItem(child_item,graph,node.name.getDepth()+1);
        node.addEdge(child_node,8);
        generateChildItems(child_node,child_item,graph);
    });
}

function getSceneGraph(item_data){
    var graph = new Graph();

    //construct root node
    var root_node = generateAnItem(item_data,graph,0);
    //start recursion
    generateChildItems(root_node,item_data,graph);

    return graph;
}