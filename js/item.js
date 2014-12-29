/**
 * Created by jacky on 12/28/14.
 */
//Item class
function Item(title,id,data){
    this.title = title;
    this.id = id;
    this.data = data;
    this.getDepth = function(){
        return this.data.depth;
    }
}