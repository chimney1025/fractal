function Triangle(canvas) {
    var limit = 10;
    var dragging;
    var mouseX;
    var mouseY;
    var dragHoldX;
    var dragHoldY;
    var pos1;
    var pos2;
    var pos3;

    var edgeLength = (canvas.width<canvas.height)?canvas.width:canvas.height;

    var pencil = canvas.getContext("2d");

    initPos();

    var bRect = canvas.getBoundingClientRect();
    canvas.addEventListener("mousedown", mouseDownListener, false);

    pencil.strokeStyle = "#e7746f";
    pencil.fillStyle = "#e7746f";

    function checkHit() {

    }

    function mouseDownListener(event) {
        mouseX = (event.clientX - bRect.left)*(canvas.width/bRect.width);
        mouseY = (event.clientY - bRect.top)*(canvas.height/bRect.height);

        dragging = true;
        window.addEventListener("mousemove", mouseMoveListener, false);
        canvas.removeEventListener("mousedown", mouseDownListener, false);
        window.addEventListener("mouseup", mouseUpListener, false);

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

        _reset();
        _move(moveX, moveY);
        initTriangle();
        _draw(pos1, pos2, pos3);
    }

    function mouseUpListener(event) {
        canvas.addEventListener("mousedown", mouseDownListener, false);
        window.removeEventListener("mouseup", mouseUpListener, false);
        if (dragging) {
            dragging = false;
            window.removeEventListener("mousemove", mouseMoveListener, false);
        }
    }

    function checkLimit(edgeLength) {
        return edgeLength > limit;
    }

    function drawTriangle(pos1, pos2, pos3) {
        pencil.beginPath();
        pencil.moveTo(pos1.x, pos1.y);
        pencil.lineTo(pos2.x, pos2.y);
        pencil.lineTo(pos3.x, pos3.y);
        pencil.fill();
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
        pencil.translate(x, y);
    }

    function _zoom(x, y) {
        pencil.scale(x, y);
        limit = limit / x;
        //edgeLength = edgeLength*n;
    }

    function _reset() {
        pencil.clearRect(pos2.x, pos1.y, edgeLength+10, edgeLength+10);
    }

    function initPos() {

        pencil.translate(canvas.width/2, canvas.height/2);

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

    function initTriangle() {

        pencil.beginPath();
        pencil.moveTo(pos1.x, pos1.y);
        pencil.lineTo(pos2.x, pos2.y);
        pencil.lineTo(pos3.x, pos3.y);
        pencil.closePath();

        pencil.stroke();

    }

    return {
        draw: function () {
            initTriangle();
            _draw(pos1, pos2, pos3);
        },

        move: function (x, y) {
            _reset();
            _move(x, y);
            initTriangle();
            _draw(pos1, pos2, pos3);

        },

        zoom: function (x, y) {
            _reset();
            _zoom(x, y);
            initTriangle();
            _draw(pos1, pos2, pos3);
        },

        reset: function() {
            _reset();
            initTriangle();
            _draw(pos1, pos2, pos3);
        }
    };
};