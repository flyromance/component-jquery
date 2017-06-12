


function inherit(child, parent) {
    var fn = function() {};
    fn.prototype = parent.prototype;
    child.prototype = new fn();
}
