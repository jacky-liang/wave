/**
 * Created by jacky on 12/28/14.
 * Item Data Abstraction
 */

const depth_scaling = 3,
    init_depth = 0,
    incer_depth = 1,
    edge_weight = 12;

//Item class
function Item(title,content,pic,depth){
    this.title = title;
    this.content = content;
    this.pic = pic;
    this.depth = depth;
    this.getDepth = function(){
        return this.depth*depth_scaling;
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
       var child_node = generateAnItem(child_item,graph,node.name.depth+incer_depth);
        node.addEdge(child_node,edge_weight);
        generateChildItems(child_node,child_item,graph);
    });
}

function getSceneGraph(item_data){
    var graph = new Graph();

    //construct root node
    var root_node = generateAnItem(item_data,graph,init_depth);
    //start recursion
    generateChildItems(root_node,item_data,graph);

    return graph;
}