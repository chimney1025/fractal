function Triangle(canvas) {
    var MIN_SIDE_LENGTH = 5;
    var MIN_TRIANGLE_LENGTH = 20;
    var sideLength = (canvas.width < canvas.height) ? canvas.width : canvas.height;
    var pencil = canvas.getContext("2d");
    pencil.translate(canvas.width / 2, canvas.height / 2);
    pencil.strokeStyle = "#e7746f";
    pencil.fillStyle = "#e7746f";

    this.draw = function(sideLength) {
        _draw(sideLength);
    };

    this.move = function(x, y) {
        _move(x, y);
    };

    this.zoom = function(n) {
        _zoom(n);
    };

    this.getCanvas = function() {
        return canvas;
    }


    function _clear() {
        pencil.clearRect(0 - sideLength, 0 - sideLength, sideLength * 2, sideLength * 2);
    }

    function _drawShape(shapeOption) {
        pencil.beginPath();
        pencil.moveTo(shapeOption.pos1.x, shapeOption.pos1.y);
        pencil.lineTo(shapeOption.pos2.x, shapeOption.pos2.y);
        pencil.lineTo(shapeOption.pos3.x, shapeOption.pos3.y);

        if (shapeOption.style == "stroke") {
            pencil.closePath();
            pencil.stroke();
        }

        if (shapeOption.style == "fill") {
            pencil.fill();
        }
    }

    function _checkLimit(shapeOption) {
        return ((shapeOption.pos3.x - shapeOption.pos2.x) > MIN_SIDE_LENGTH);
    }

    function _calculate(shapeOption) {
        if (_checkLimit(shapeOption)) {
            _calculateInner(shapeOption);
            _calculateTopTriangle(shapeOption);
            _calculateLeftTriangle(shapeOption);
            _calculateRightTriangle(shapeOption);
        }
    }

    function _calculateInner(shapeOption) {
        var option = {
            pos1: {
                x: (shapeOption.pos1.x + shapeOption.pos2.x) / 2,
                y: (shapeOption.pos1.y + shapeOption.pos2.y) / 2
            },
            pos2: {
                x: (shapeOption.pos1.x + shapeOption.pos3.x) / 2,
                y: (shapeOption.pos1.y + shapeOption.pos3.y) / 2
            },
            pos3: {
                x: (shapeOption.pos2.x + shapeOption.pos3.x) / 2,
                y: (shapeOption.pos2.y + shapeOption.pos3.y) / 2
            },
            style: "fill"
        };

        _drawShape(option);
    }

    function _calculateTopTriangle(shapeOption) {
        var option = {
            pos1: {
                x: shapeOption.pos1.x,
                y: shapeOption.pos1.y
            },
            pos2: {
                x: (shapeOption.pos1.x + shapeOption.pos2.x) / 2,
                y: (shapeOption.pos1.y + shapeOption.pos2.y) / 2
            },
            pos3: {
                x: (shapeOption.pos1.x + shapeOption.pos3.x) / 2,
                y: (shapeOption.pos1.y + shapeOption.pos3.y) / 2
            },
            style: "fill"
        };

        _calculate(option);
    }

    function _calculateLeftTriangle(shapeOption) {
        var option = {
            pos1: {
                x: (shapeOption.pos1.x + shapeOption.pos2.x) / 2,
                y: (shapeOption.pos1.y + shapeOption.pos2.y) / 2
            },
            pos2: {
                x: shapeOption.pos2.x,
                y: shapeOption.pos2.y
            },
            pos3: {
                x: (shapeOption.pos2.x + shapeOption.pos3.x) / 2,
                y: (shapeOption.pos2.y + shapeOption.pos3.y) / 2
            },
            style: "fill"
        };

        _calculate(option);
    }

    function _calculateRightTriangle(shapeOption) {
        var option = {
            pos1: {
                x: (shapeOption.pos1.x + shapeOption.pos3.x) / 2,
                y: (shapeOption.pos1.y + shapeOption.pos3.y) / 2
            },
            pos2: {
                x: (shapeOption.pos2.x + shapeOption.pos3.x) / 2,
                y: (shapeOption.pos2.y + shapeOption.pos3.y) / 2
            },
            pos3: {
                x: shapeOption.pos3.x,
                y: shapeOption.pos3.y
            },
            style: "fill"
        };

        _calculate(option);
    }

    function _draw(newLength) {
        sideLength = newLength || sideLength;

        var outer_option = {
            pos1: {
                x: 0,
                y: 0 - sideLength / 2
            },
            pos2: {
                x: 0 - sideLength / 2,
                y: sideLength / 2
            },
            pos3: {
                x: sideLength / 2,
                y: sideLength / 2
            },
            style: "stroke"
        };

        _drawShape(outer_option);

        var inner_option = {
            pos1: {
                x: 0,
                y: 0 - sideLength / 2
            },
            pos2: {
                x: 0 - sideLength / 2,
                y: sideLength / 2
            },
            pos3: {
                x: sideLength / 2,
                y: sideLength / 2
            },
            style: "fill"
        };

        _calculate(inner_option);
    }

    function _move(x, y) {
        _clear();
        pencil.translate(x, y);
        _draw(sideLength);
    }

    function _zoom(n) {
        if (n > 0 || sideLength > MIN_TRIANGLE_LENGTH) {
            _clear();
            sideLength += n;
            _draw(sideLength);
        }
    }
}


function TriangleController() {
    var canvas, boundary, dragging, mouseX, mouseY;
    var MOVE_LEVEL = 10;
    var ZOOM_LEVEL = 10;

    function _checkBrowser() {
        if (navigator.userAgent.indexOf("Firefox") != -1) {
            return "firefox";
        }
    }

    function _add(element, eventName, listener) {
        if (element.attachEvent) {
            element.attachEvent("on" + eventName, listener);
        } else if (element.addEventListener) {
            element.addEventListener(eventName, listener, false);
        }
    }

    function _remove(element, eventName, listener) {
        if (element.detachEvent) {
            element.detachEvent("on" + eventName, listener);
        } else if (element.removeEventListener) {
            element.removeEventListener(eventName, listener, false);
        }
    }

    function _addMouseWheel(element, listener) {
        if (element.attachEvent) {
            element.attachEvent("onmousewheel", function(event) {
                return listener(ZOOM_LEVEL * event.wheelDelta / 120);
            });
        } else if (element.addEventListener) {

            if (_checkBrowser() == "firefox") {
                element.addEventListener("DOMMouseScroll", function(event) {
                    return listener(0 - ZOOM_LEVEL * event.detail / 3, event.clientX, event.clientY);
                }, false);
            } else {
                element.addEventListener("mousewheel", function(event) {
                    return listener(ZOOM_LEVEL * event.wheelDelta / 120, event.clientX, event.clientY);
                }, false);
            }
        }
    }

    function _mouseDownListener(event) {
        mouseX = (event.clientX - boundary.left) * (canvas.width / boundary.width);
        mouseY = (event.clientY - boundary.top) * (canvas.height / boundary.height);
        dragging = true;

        _add(window, "mousemove", _mouseMoveListener);
        _add(window, "mouseup", _mouseUpListener);
        _remove(canvas, "mousedown", _mouseDownListener);

        if (event.preventDefault) {
            event.preventDefault();
        } else if (event.returnValue) {
            event.returnValue = false;
        }

        return false;
    }

    function _mouseMoveListener(event) {
        var mouseCrtX = (event.clientX - boundary.left) * (canvas.width / boundary.width);
        var mouseCrtY = (event.clientY - boundary.top) * (canvas.height / boundary.height);

        var moveX = mouseCrtX - mouseX;
        var moveY = mouseCrtY - mouseY;
        mouseX = mouseCrtX;
        mouseY = mouseCrtY;

        triangle.move(moveX, moveY);
    }

    function _mouseUpListener(event) {
        _add(canvas, "mousedown", _mouseDownListener);
        _remove(window, "mouseup", _mouseUpListener);

        if (dragging) {
            dragging = false;
            _remove(window, "mousemove", _mouseMoveListener);
        }
    }

    function _mouseWheelListener(level) {
        triangle.zoom(level);
    }

    function _keyDownListener(event) {
        switch (event.keyCode) {
            case 38:
                triangle.move(0, 0 - MOVE_LEVEL);
                break;
            case 40:
                triangle.move(0, MOVE_LEVEL);
                break;
            case 37:
                triangle.move(0 - MOVE_LEVEL, 0);
                break;
            case 39:
                triangle.move(MOVE_LEVEL, 0);
                break;
            case 107:
                triangle.zoom(MOVE_LEVEL);
                break;
            case 109:
                triangle.zoom(0 - MOVE_LEVEL);
                break;
            default:
                break;
        }
    }

    this.bind = function(triangle) {
        canvas = triangle.getCanvas();
        boundary = canvas.getBoundingClientRect();

        _add(canvas, "mousedown", _mouseDownListener);
        _addMouseWheel(canvas, _mouseWheelListener)
        _add(window, "keydown", _keyDownListener);
    }
}
