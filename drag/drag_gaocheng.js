// 禁止选中文本
function disableSelect() {
    // ie: document.selection.empty();
    // other: window.getSelection.removeAllRanges();
    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty(); 
}

// 获取样式
function getStyle(elem, style) {
    // document.defaultView === window
    return document.defaultView.getComputedStyle ? document.defaultView.getComputedStyle(elem, false)[style] : elem.currentStyle[style];
}


var drag = (function() {
    var dragging = null;
    var diffX = 0,
        diffY = 0;

    function handleEvent(event) {
        event = eventUtil.getEvent(event);
        var target = eventUtil.getTarget(event);

        switch (event.type) {
            case 'mousedown':
                if (target.className.indexOf('draggable') > -1) {
                    dragging = target;
                    diffX = event.clientX - target.offsetLeft;
                    diffY = event.clientY - target.offsetTop;
                }
                break;
            case 'mousemove':
                if (dragging) {
                    dragging.style.left = (event.clientX - diffX) + 'px';
                    dragging.style.top = (event.clientY - diffY) + 'px';
                }
                disableSelect();
                break;
            case 'mouseup':
                dragging = null;
                break;
        } 
    }

    return {
        enable: function() {
            eventUtil.addEvent(document, 'mousedown', handleEvent);
            eventUtil.addEvent(document, 'mousemove', handleEvent);
            eventUtil.addEvent(document, 'mouseup', handleEvent);
        },
        disable: function() {
            eventUtil.removeEvent(document, 'mousedown', handleEvent);
            eventUtil.removeEvent(document, 'mousemove', handleEvent);
            eventUtil.removeEvent(document, 'mouseup', handleEvent);
        }
    };
})();
drag.enable();
// drag.disable();