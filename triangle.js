/*
 * Canvas responsibilities:
 *
 * initial triangle
 * draw triangle
 * move triangle
 * zoom triangle
 * add mouse listener
 * add key listener
 *
 * Triangle responsibilities:
 *
 * draw shape
 * translate shape
 *
 * Listener responsibilities:
 *
 * when mouse down - update mouse position
 * when mouse move - move triangle
 * when mouse up - stop moving triangle
 * when mouse scroll - zoom triangle
 * */

function Canvas(canvas, pLength) {
    var limit = 10,
        scale = 1,
        pencil,
        trianglePos,
        bRect,
        dragging,
        edgeLength;

    initPosition(pLength);
    var triangle = new Triangle();
    var listener = new Listener();
    listener.init(canvas, triangle);

    function initPosition(pLength) {
        pencil = canvas.getContext("2d");
        pencil.strokeStyle = "#e7746f";
        pencil.fillStyle = "#e7746f";
        pencil.translate(canvas.width/2, canvas.height/2);

        trianglePos = {
            pos1: {
                x: 0,
                y: 0 - edgeLength / 2
            },
            pos2: {
                x: 0 - edgeLength / 2,
                y: edgeLength / 2
            },
            pos3 : {
                x: edgeLength / 2,
                y: edgeLength / 2
            }
        };

        bRect = canvas.getBoundingClientRect();

        edgeLength = pLength || ((canvas.width<canvas.height)?canvas.width:canvas.height);
    }

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
            _calculate(pos1, pos2, pos3);
        }

        function mouseWheelListener(level, posX, posY) {
            _reset();
            _zoom(level);
            drawTriangle(pos1, pos2, pos3, true);
            _calculate(pos1, pos2, pos3);
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
            _calculate(pos1, pos2, pos3);
        }

        function mouseUpListener(event) {
            listener.add(canvas, "mousedown", mouseDownListener);
            listener.remove(window, "mouseup", mouseUpListener);

            if (dragging) {
                dragging = false;
                listener.remove(window, "mousemove", mouseMoveListener);
            }
        }

        return {
            init: function(element, actor){
                
            }
        }
    }

    function Triangle() {

        function checkLimit(edgeLength) {
            return edgeLength > limit;
        }

        function drawOuterTriangle(trianglePos) {
            pencil.moveTo(trianglePos.pos1.x, trianglePos.pos1.y);
            pencil.lineTo(trianglePos.pos2.x, trianglePos.pos2.y);
            pencil.lineTo(trianglePos.pos3.x, trianglePos.pos3.y);
            pencil.closePath();
            pencil.stroke();
        }



        function drawInnerTriangle(trianglePos) {
            pencil.moveTo(trianglePos.pos1.x, trianglePos.pos1.y);
            pencil.lineTo(trianglePos.pos2.x, trianglePos.pos2.y);
            pencil.lineTo(trianglePos.pos3.x, trianglePos.pos3.y);
            pencil.fill();
        }

        function calculateTopTriangle(pos1, pos2, pos3) {
            var p1 = {
                x: trianglePos.pos1.x,
                y: trianglePos.pos1.y
            };
            var p2 = {
                x: (trianglePos.pos1.x + trianglePos.pos2.x) / 2,
                y: (trianglePos.pos1.y + trianglePos.pos2.y) / 2
            };
            var p3 = {
                x: (trianglePos.pos1.x + trianglePos.pos3.x) / 2,
                y: (trianglePos.pos1.y + trianglePos.pos3.y) / 2
            };

            _calculate({
                pos1: p1,
                pos2: p2,
                pos3: p3
            });
        }

        function calculateLeftTriangle(pos1, pos2, pos3) {
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

            _calculate({
                pos1: p1,
                pos2: p2,
                pos3: p3
            });
        }

        function calculateRightTriangle(trianglePos) {
            var p1 = {
                x: (trianglePos.pos1.x + trianglePos.pos3.x) / 2,
                y: (trianglePos.pos1.y + trianglePos.pos3.y) / 2
            };
            var p2 = {
                x: (trianglePos.pos2.x + trianglePos.pos3.x) / 2,
                y: (trianglePos.pos2.y + trianglePos.pos3.y) / 2
            };
            var p3 = {
                x: trianglePos.pos3.x,
                y: trianglePos.pos3.y
            };

            _calculate({
                pos1: p1,
                pos2: p2,
                pos3: p3
            });
        }

        function calculateInnerTriangle(trianglePos) {
            var p1 = {
                x: (trianglePos.pos1.x + trianglePos.pos2.x) / 2,
                y: (trianglePos.pos1.y + trianglePos.pos2.y) / 2
            };

            var p2 = {
                x: (trianglePos.pos1.x + trianglePos.pos3.x) / 2,
                y: (trianglePos.pos1.y + trianglePos.pos3.y) / 2
            };

            var p3 = {
                x: (trianglePos.pos2.x + trianglePos.pos3.x) / 2,
                y: (trianglePos.pos2.y + trianglePos.pos3.y) / 2
            };

            drawInnerTriangle({
                pos1: p1,
                pos2: p2,
                pos3: p3
            });
        }

        function _calculate(trianglePos) {
            if (checkLimit(trianglePos.pos3.x - trianglePos.pos2.x)) {
                calculateInnerTriangle(trianglePos);
                calculateTopTriangle(trianglePos);
                calculateLeftTriangle(trianglePos);
                calculateRightTriangle(trianglePos);
            }
        }

        function _move(x, y) {
            pencil.translate(x/scale, y/scale);
            drawOuterTriangle(trianglePos);
            _calculate(trianglePos);
        }

        function _zoom(n) {
            if( (n < 0 && checkLimit(edgeLength + n/scale) ) || n>0 ) {
                edgeLength += n/scale;
                initPos();
                drawOuterTriangle(trianglePos);
                _calculate(trianglePos);
            }
        }

        function _scale(n) {
            scale *= n;
            if( (n < 1 && limit < 100) || n > 1) {
                pencil.scale(n, n);
                limit = limit / n;
                drawOuterTriangle(trianglePos);
                _calculate(trianglePos);
            }
        }

        function _reset() {
            //pencil.clearRect(0-canvas.width/2, 0-canvas.height/2, canvas.width, canvas.height);
            //pencil.clearRect(pos2.x-10, pos1.y-10, (pos3.x - pos2.x + 10), (pos3.y - pos1.y + 10));
            //set a larger area as otherwise the 'border' will be left
            pencil.clearRect(0-edgeLength, 0-edgeLength, edgeLength*2, edgeLength*2);
        }

        return {
            draw: function (trianglePos) {
                drawOuterTriangle(trianglePos);
                _calculate(trianglePos);
            },

            move: function (x, y) {
                _reset();
                _move(x, y);

            },

            zoom: function (n) {
                _reset();
                _zoom(n);
            }
        };
    }

    return {
        draw: function () {
            drawOuterTriangle(pos1, pos2, pos3);
            _calculate(pos1, pos2, pos3);
        },

        move: function (x, y) {
            _reset();
            _move(x, y);

        },

        zoom: function (n) {
            _reset();
            _zoom(n);
        }
    };
}