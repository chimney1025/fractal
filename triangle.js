function Triangle(canvas) {
    var sideLength = (canvas.width < canvas.height) ? canvas.width : canvas.height;
    var boundry = canvas.getBoundingClientRect();
    var pencil = canvas.getContext("2d");
    pencil.translate(canvas.width / 2, canvas.height / 2);
    pencil.strokeStyle = "#e7746f";
    pencil.fillStyle = "#e7746f";
    var limit = 10;
    var dragging, mouseX, mouseY;
    var shape;
    var listener = new Listener();
    listener.init();

    this.draw = function(sideLength) {
        _draw(sideLength);
    };

    this.move = function(x, y) {
        _move(x, y);
    };

    this.zoom = function(n) {
        _zoom(n);
    };


    function _clear() {
        pencil.clearRect(0 - sideLength, 0 - sideLength, sideLength * 2, sideLength * 2);
    }

    function _checkLimit(option) {
        return ((option.pos3.x - option.pos2.x) > limit);
    }

    function _calculate(option) {
        if (_checkLimit(option)) {
            _calculateInner(option);
            _calculateTop(option);
            _calculateLeft(option);
            _calculateRight(option);
        }
    }

    function _calculateInner(option) {
        var option = {
            pos1: {
                x: (option.pos1.x + option.pos2.x) / 2,
                y: (option.pos1.y + option.pos2.y) / 2
            },
            pos2: {
                x: (option.pos1.x + option.pos3.x) / 2,
                y: (option.pos1.y + option.pos3.y) / 2
            },
            pos3: {
                x: (option.pos2.x + option.pos3.x) / 2,
                y: (option.pos2.y + option.pos3.y) / 2
            },
            style: "fill"
        };

        shape.draw(option);
    }

    function _calculateTop(option) {
        var option = {
            pos1: {
                x: option.pos1.x,
                y: option.pos1.y
            },
            pos2: {
                x: (option.pos1.x + option.pos2.x) / 2,
                y: (option.pos1.y + option.pos2.y) / 2
            },
            pos3: {
                x: (option.pos1.x + option.pos3.x) / 2,
                y: (option.pos1.y + option.pos3.y) / 2
            },
            style: "fill"
        };

        _calculate(option);
    }

    function _calculateLeft(option) {
        var option = {
            pos1: {
                x: (option.pos1.x + option.pos2.x) / 2,
                y: (option.pos1.y + option.pos2.y) / 2
            },
            pos2: {
                x: option.pos2.x,
                y: option.pos2.y
            },
            pos3: {
                x: (option.pos2.x + option.pos3.x) / 2,
                y: (option.pos2.y + option.pos3.y) / 2
            },
            style: "fill"
        };

        _calculate(option);
    }

    function _calculateRight(option) {
        var option = {
            pos1: {
                x: (option.pos1.x + option.pos3.x) / 2,
                y: (option.pos1.y + option.pos3.y) / 2
            },
            pos2: {
                x: (option.pos2.x + option.pos3.x) / 2,
                y: (option.pos2.y + option.pos3.y) / 2
            },
            pos3: {
                x: option.pos3.x,
                y: option.pos3.y
            },
            style: "fill"
        };

        _calculate(option);
    }

    function _draw(newLength) {
        sideLength = newLength || sideLength;
        shape = new Shape();

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

        shape.draw(outer_option);

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
        if (n > 0 || sideLength > limit) {
            _clear();
            sideLength += n;
            _draw(sideLength);
        }
    }

    function Shape() {
        function _draw(option) {
            pencil.beginPath();
            pencil.moveTo(option.pos1.x, option.pos1.y);
            pencil.lineTo(option.pos2.x, option.pos2.y);
            pencil.lineTo(option.pos3.x, option.pos3.y);

            if (option.style == "stroke") {
                pencil.closePath();
                pencil.stroke();
            }

            if (option.style == "fill") {
                pencil.fill();
            }
        };

        this.draw = function(option) {
            _draw(option);
        }
    }

    function Listener() {
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
                    return listener(event.wheelDelta / 12);
                });
            } else if (element.addEventListener) {

                if (_checkBrowser() == "firefox") {
                    element.addEventListener("DOMMouseScroll", function(event) {
                        return listener(0 - event.detail * 20 / 3, event.clientX, event.clientY);
                    }, false);
                } else {
                    element.addEventListener("mousewheel", function(event) {
                        return listener(event.wheelDelta / 6, event.clientX, event.clientY);
                    }, false);
                }
            }
        }

        function _addMouseDownListener() {
            _add(canvas, "mousedown", _mouseDownListener);
        }

        function _mouseDownListener(event) {
            mouseX = (event.clientX - boundry.left) * (canvas.width / boundry.width);
            mouseY = (event.clientY - boundry.top) * (canvas.height / boundry.height);
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
            var mouseCrtX = (event.clientX - boundry.left) * (canvas.width / boundry.width);
            var mouseCrtY = (event.clientY - boundry.top) * (canvas.height / boundry.height);

            var moveX = mouseCrtX - mouseX;
            var moveY = mouseCrtY - mouseY;
            mouseX = mouseCrtX;
            mouseY = mouseCrtY;

            _move(moveX, moveY);
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
            _zoom(level);
        }

        function _keyDownListener(event) {
            switch (event.keyCode) {
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
        }

        this.init = function() {
            _addMouseDownListener();
            _addMouseWheel(canvas, _mouseWheelListener)
            _add(window, "keydown", _keyDownListener);
        }
    }
}