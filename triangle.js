var Triangle = function (canvas) {
    var limit = 10;

    var pencil = canvas.getContext("2d");
    pencil.strokeStyle = "#e7746f";
    pencil.fillStyle = "#e7746f";

    var edgeLength = canvas.width;

    pencil.translate(edgeLength/2, edgeLength/2);

    var pos1 = {
        x: 0,
        y: 0 - edgeLength / 2
    };
    var pos2 = {
        x: 0 - edgeLength / 2,
        y: edgeLength / 2
    };
    var pos3 = {
        x: edgeLength / 2,
        y: edgeLength / 2
    };

    var checkLimit = function (edgeLength) {
        return edgeLength > limit;
    };

    var drawTriangle = function (pos1, pos2, pos3) {
        pencil.beginPath();
        pencil.moveTo(pos1.x, pos1.y);
        pencil.lineTo(pos2.x, pos2.y);
        pencil.lineTo(pos3.x, pos3.y);
        pencil.fill();
    };

    var drawTopTriangle = function (pos1, pos2, pos3) {
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
    };

    var drawLeftTriangle = function (pos1, pos2, pos3) {
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
    };

    var drawRightTriangle = function (pos1, pos2, pos3) {
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
    };

    var drawInnerTriangle = function (pos1, pos2, pos3) {
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
    };

    var _draw = function (pos1, pos2, pos3) {
        if (checkLimit(pos3.x - pos2.x)) {
            drawInnerTriangle(pos1, pos2, pos3);
            drawTopTriangle(pos1, pos2, pos3);
            drawLeftTriangle(pos1, pos2, pos3);
            drawRightTriangle(pos1, pos2, pos3);
        }
    };

    var _move = function (x, y) {
        pencil.translate(x, y);
    };

    var _zoom = function(x, y) {
        pencil.scale(x, y);
        limit = limit / x;
    };

    var _reset = function() {
        pencil.clearRect(pos2.x, pos1.y, edgeLength+10, edgeLength+10);
    };

    var initTriangle = function () {

        pencil.beginPath();
        pencil.moveTo(pos1.x, pos1.y);
        pencil.lineTo(pos2.x, pos2.y);
        pencil.lineTo(pos3.x, pos3.y);
        pencil.closePath();

        pencil.stroke();

    };

    return {
        draw: function () {
            initTriangle();
            _draw(pos1, pos2, pos3);
        },

        move: function (x, y) {
            _move(x, y);
        },

        zoom: function (x, y) {
            _zoom(x, y);
        },

        reset: function() {
            _reset();
        }
    };
};