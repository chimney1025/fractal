function Listener() {

    function _checkBrowser() {
        if(navigator.userAgent.indexOf("Firefox") != -1) {
            return "firefox";
        }
    }

    function _add(element, eventName, listener) {
        if(element.attachEvent) {

            element.attachEvent("on" + eventName, listener);

        } else if(element.addEventListener) {

            element.addEventListener(eventName, listener, false);

        }
    }

    function _remove(element, eventName, listener) {
        if(element.detachEvent) {

            element.detachEvent("on" + eventName, listener);

        } else if(element.removeEventListener) {

            element.removeEventListener(eventName, listener, false);

        }
    }

    function _addMouseWheel(element, listener) {
        if(element.attachEvent) {

            element.attachEvent("onmousewheel", function(event){
                return listener(event.wheelDelta/12);
            });

        } else if(element.addEventListener) {

            if(_checkBrowser() == "firefox") {
                element.addEventListener("DOMMouseScroll", function(event){
                    return listener(0 - event.detail*20/3, event.clientX, event.clientY);
                }, false);
            } else {
                element.addEventListener("mousewheel", function(event){
                    return listener(event.wheelDelta/6, event.clientX, event.clientY);
                }, false);
            }

        }
    }

    return {
        add: function(element, eventName, listener) {
            if(eventName == "mousewheel") {
                _addMouseWheel(element, listener);
            } else {
                _add(element, eventName, listener);
            }
        },

        remove: function(element, eventName, listener) {
            _remove(element, eventName, listener);

        }
    }
}

function Triangle(canvas, edgeLength) {
    var limit = 10;
    var dragging;
    var mouseX;
    var mouseY;
    var pos1;
    var pos2;
    var pos3;
    var scale = 1;
    var edgeLength = edgeLength || ((canvas.width<canvas.height)?canvas.width:canvas.height) ;
    var bRect = canvas.getBoundingClientRect();
    var pencil = canvas.getContext("2d");
    var listener = new Listener();

    pencil.translate(canvas.width/2, canvas.height/2);
    initPos();

    listener.add(canvas, "mousedown", mouseDownListener);
    listener.add(canvas, "mousewheel", mouseWheelListener);
    listener.add(window, "keydown", keyPressListener);

    pencil.strokeStyle = "#e7746f";
    pencil.fillStyle = "#e7746f";

    function keyPressListener(event) {
        _reset();

        switch(event.keyCode){
            case 38:
                _move(0, -10);
                break;
            case 40:
                _move(0, 10);
                break;
            case 37:
                _move(-10, 0);
                break;
            case 39:
                _move(10, 0);
                break;
            case 107:
                _zoom(10);
                break;
            case 109:
                _zoom(-10);
                break;
            default:
                break;
        }

        drawTriangle(pos1, pos2, pos3, true);
        _draw(pos1, pos2, pos3);
    }

    function mouseWheelListener(level, posX, posY) {
        _reset();
        _zoom(level);
        drawTriangle(pos1, pos2, pos3, true);
        _draw(pos1, pos2, pos3);
    }

    function mouseDownListener(event) {
        mouseX = (event.clientX - bRect.left)*(canvas.width/bRect.width);
        mouseY = (event.clientY - bRect.top)*(canvas.height/bRect.height);

        dragging = true;

        listener.add(window, "mousemove", mouseMoveListener);
        listener.remove(canvas, "mousedown", mouseDownListener);
        listener.add(window, "mouseup", mouseUpListener);

        if (event.preventDefault) {
            event.preventDefault();
        } else if (event.returnValue) {
            event.returnValue = false;
        }

        return false;
    }

    function mouseMoveListener(event) {
        var mouseCrtX = (event.clientX - bRect.left)*(canvas.width/bRect.width);
        var mouseCrtY = (event.clientY - bRect.top)*(canvas.height/bRect.height);

        var moveX = mouseCrtX - mouseX;
        var moveY = mouseCrtY - mouseY;
        mouseX = mouseCrtX;
        mouseY = mouseCrtY;

        _reset();
        _move(moveX, moveY);
        drawTriangle(pos1, pos2, pos3, true);
        _draw(pos1, pos2, pos3);
    }

    function mouseUpListener(event) {
        listener.add(canvas, "mousedown", mouseDownListener);
        listener.remove(window, "mouseup", mouseUpListener);

        if (dragging) {
            dragging = false;
            listener.remove(window, "mousemove", mouseMoveListener);
        }
    }

    function checkLimit(edgeLength) {
        return edgeLength > limit;
    }

    function drawTriangle(pos1, pos2, pos3, outer) {
        pencil.beginPath();
        pencil.moveTo(pos1.x, pos1.y);
        pencil.lineTo(pos2.x, pos2.y);
        pencil.lineTo(pos3.x, pos3.y);

        if(outer) {
            pencil.closePath();
            pencil.stroke();
        } else {
            pencil.fill();
        }
    }

    function drawTopTriangle(pos1, pos2, pos3) {
        var p1 = {
            x: pos1.x,
            y: pos1.y
        };
        var p2 = {
            x: (pos1.x + pos2.x) / 2,
            y: (pos1.y + pos2.y) / 2
        };
        var p3 = {
            x: (pos1.x + pos3.x) / 2,
            y: (pos1.y + pos3.y) / 2
        };

        _draw(p1, p2, p3);
    }

    function drawLeftTriangle(pos1, pos2, pos3) {
        var p1 = {
            x: (pos1.x + pos2.x) / 2,
            y: (pos1.y + pos2.y) / 2
        };
        var p2 = {
            x: pos2.x,
            y: pos2.y
        };
        var p3 = {
            x: (pos2.x + pos3.x) / 2,
            y: (pos2.y + pos3.y) / 2
        };

        _draw(p1, p2, p3);
    }

    function drawRightTriangle(pos1, pos2, pos3) {
        var p1 = {
            x: (pos1.x + pos3.x) / 2,
            y: (pos1.y + pos3.y) / 2
        };
        var p2 = {
            x: (pos2.x + pos3.x) / 2,
            y: (pos2.y + pos3.y) / 2
        };
        var p3 = {
            x: pos3.x,
            y: pos3.y
        };

        _draw(p1, p2, p3);
    }

    function drawInnerTriangle(pos1, pos2, pos3) {
        var p1 = {
            x: (pos1.x + pos2.x) / 2,
            y: (pos1.y + pos2.y) / 2
        };

        var p2 = {
            x: (pos1.x + pos3.x) / 2,
            y: (pos1.y + pos3.y) / 2
        };

        var p3 = {
            x: (pos2.x + pos3.x) / 2,
            y: (pos2.y + pos3.y) / 2
        };

        drawTriangle(p1, p2, p3);
    }

    function _draw(pos1, pos2, pos3) {
        if (checkLimit(pos3.x - pos2.x)) {
            drawInnerTriangle(pos1, pos2, pos3);
            drawTopTriangle(pos1, pos2, pos3);
            drawLeftTriangle(pos1, pos2, pos3);
            drawRightTriangle(pos1, pos2, pos3);
        }
    }

    function _move(x, y) {
        pencil.translate(x/scale, y/scale);
    }

    function _zoom(n) {
        if( (n < 0 && checkLimit(edgeLength + n/scale) ) || n>0 ) {
            edgeLength += n/scale;
            initPos();
        }
    }

    function _scale(n) {
        scale *= n;
        if( (n < 1 && limit < 100) || n > 1) {
            pencil.scale(n, n);
            limit = limit / n;
        }
    }

    function _reset() {
        //pencil.clearRect(0-canvas.width/2, 0-canvas.height/2, canvas.width, canvas.height);
        //pencil.clearRect(pos2.x-10, pos1.y-10, (pos3.x - pos2.x + 10), (pos3.y - pos1.y + 10));
        //set a larger area as otherwise the 'border' will be left
        pencil.clearRect(0-edgeLength, 0-edgeLength, edgeLength*2, edgeLength*2);
    }

    function initPos() {
        pos1 = {
            x: 0,
            y: 0 - edgeLength / 2
        };
        pos2 = {
            x: 0 - edgeLength / 2,
            y: edgeLength / 2
        };
        pos3 = {
            x: edgeLength / 2,
            y: edgeLength / 2
        };
    }

    return {
        draw: function () {
            drawTriangle(pos1, pos2, pos3, true);
            _draw(pos1, pos2, pos3);
        },

        move: function (x, y) {
            _reset();
            _move(x, y);
            drawTriangle(pos1, pos2, pos3, true);
            _draw(pos1, pos2, pos3);

        },

        zoom: function (n) {
            _reset();
            _zoom(n);
            drawTriangle(pos1, pos2, pos3, true);
            _draw(pos1, pos2, pos3);
        },

        scale: function (n) {
            _reset();
            _scale(n);
            drawTriangle(pos1, pos2, pos3, true);
            _draw(pos1, pos2, pos3);
        },

        reset: function() {
            _reset();
            drawTriangle(pos1, pos2, pos3, true);
            _draw(pos1, pos2, pos3);
        }
    };
};