describe("Triangle", function() {
    var triangle, controller;

    var pencil = new Context();
    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = 400;
    var canvas = new Canvas(CANVAS_WIDTH, CANVAS_HEIGHT);

    function Context(){
        this.strokeStyle = "";
        this.fillStyle = "";
    }

    Context.prototype.translate = function() {};
    Context.prototype.moveTo = function() {};
    Context.prototype.lineTo = function() {};
    Context.prototype.beginPath = function() {};
    Context.prototype.closePath = function() {};
    Context.prototype.clearRect = function() {};
    Context.prototype.stroke = function() {};
    Context.prototype.fill = function() {};

    function Canvas(width, height){
        this.width = width;
        this.height = height;
    }

    Canvas.prototype.getContext = function(){
        return pencil;
    };

    Canvas.prototype.getBoundingClientRect = function(){
        return {
            left: 0,
            top: 0,
            width: this.width,
            height: this.height
        }
    };

    describe("Triangle Initialization", function(){
        beforeEach(function(){
            spyOn(canvas, 'getContext').and.callThrough();
            spyOn(pencil, 'translate').and.callThrough();
            triangle = new Triangle(canvas);
        });

        it("should return correct canvas size", function() {
            var local_canvas = triangle.getCanvas();
            expect(local_canvas.width).toEqual(CANVAS_WIDTH);
            expect(local_canvas.height).toEqual(CANVAS_HEIGHT);
        });

        it("should get the pencil by calling the method canvas.getContext with 2d", function() {
            expect(canvas.getContext).toHaveBeenCalledWith("2d");
        });

        it("should call pencil.translate, once, with canvas.width/2, canvas.heigth/2", function() {
            expect(pencil.translate).toHaveBeenCalledWith(canvas.width/2, canvas.height/2);
            expect(pencil.translate.calls.count()).toEqual(1);
        });

        it("should set the context style", function() {
            expect(pencil.strokeStyle).toEqual("#e7746f");
            expect(pencil.fillStyle).toEqual("#e7746f");
        });
    });

    describe("Triangle Draw", function(){
        beforeEach(function(){
            triangle = new Triangle(canvas);
        });

        it("should not call pencil.translate", function(){
            spyOn(pencil, 'translate').and.callThrough();
            triangle.draw(100);
            expect(pencil.translate).not.toHaveBeenCalled();
        });

        it("should call pencil methods", function(){
            spyOn(pencil, 'beginPath').and.callThrough();
            spyOn(pencil, 'moveTo').and.callThrough();
            spyOn(pencil, 'lineTo').and.callThrough();
            spyOn(pencil, 'closePath').and.callThrough();
            spyOn(pencil, 'stroke').and.callThrough();
            spyOn(pencil, 'fill').and.callThrough();

            triangle.draw(100);

            expect(pencil.beginPath).toHaveBeenCalled();
            expect(pencil.moveTo).toHaveBeenCalled();
            expect(pencil.lineTo).toHaveBeenCalled();
            expect(pencil.closePath).toHaveBeenCalled();
            expect(pencil.stroke).toHaveBeenCalled();
            expect(pencil.fill).toHaveBeenCalled();
        });
    });

    describe("Triangle move", function(){
        beforeEach(function(){
            triangle = new Triangle(canvas);
            this.moveX = 10;
            this.moveY = 10;
        });

        it("should call pencil.clearRect", function(){
            spyOn(pencil, 'clearRect').and.callThrough();
            triangle.draw(100);
            triangle.move(this.moveX, this.moveY);
            expect(pencil.clearRect).toHaveBeenCalledWith(-100, -100, 200, 200);
        });

        it("should call pencil.translate, with moveX, moveY", function(){
            spyOn(pencil, 'translate').and.callThrough();
            triangle.draw(100);
            triangle.move(this.moveX, this.moveY);
            expect(pencil.translate.calls.count()).toEqual(1);
            expect(pencil.translate).toHaveBeenCalledWith(this.moveX, this.moveY);
        });

    });

    describe("Triangle zoom", function(){
        beforeEach(function(){
            triangle = new Triangle(canvas);
            spyOn(pencil, 'translate').and.callThrough();
        });

        it("should call pencil.clearRect once: zoom in 10 from 100", function(){
            spyOn(pencil, 'clearRect').and.callThrough();
            triangle.draw(100);
            triangle.zoom(10);
            expect(pencil.clearRect.calls.count()).toEqual(1);
            expect(pencil.translate).not.toHaveBeenCalled();
        });

        it("should call pencil.clearRect once: zoom out 10 from 100", function(){
            spyOn(pencil, 'clearRect').and.callThrough();
            triangle.draw(100);
            triangle.zoom(-10);
            expect(pencil.clearRect.calls.count()).toEqual(1);
            expect(pencil.translate).not.toHaveBeenCalled();
        });

        it("should call pencil.clearRect once: zoom in 1 from 5", function(){
            spyOn(pencil, 'clearRect').and.callThrough();
            triangle.draw(20);
            triangle.zoom(1);
            expect(pencil.clearRect).toHaveBeenCalledWith(-20, -20, 40, 40);
            expect(pencil.clearRect.calls.count()).toEqual(1);
            expect(pencil.translate).not.toHaveBeenCalled();
        });

        it("should call pencil.clearRect once: zoom out 1 from 5", function(){
            spyOn(pencil, 'clearRect').and.callThrough();
            triangle.draw(20);
            triangle.zoom(-1);
            expect(pencil.clearRect).not.toHaveBeenCalled();
            expect(pencil.translate).not.toHaveBeenCalled();
        });

        it("should call pencil.clearRect once: zoom out 1 from 6", function(){
            spyOn(pencil, 'clearRect').and.callThrough();
            triangle.draw(21);
            triangle.zoom(-1);
            expect(pencil.clearRect).toHaveBeenCalled();
            expect(pencil.translate).not.toHaveBeenCalled();
        });

    });

    describe("Controller Bind", function(){
        beforeEach(function(){
            controller = new TriangleController();
            triangle = new Triangle(canvas);

            spyOn(triangle, 'getCanvas').and.callThrough();
            spyOn(canvas, 'getBoundingClientRect').and.callThrough();

            spyOn(triangle, 'draw').and.callThrough();

            spyOn(triangle, 'move').and.callThrough();
            spyOn(triangle, 'zoom').and.callThrough();

            controller.bind(triangle);
        });

        it("should call triangle.getCanvas", function(){
            expect(triangle.getCanvas).toHaveBeenCalled();
        });

        it("should call canvas.getBoundingClientRect", function(){
            expect(canvas.getBoundingClientRect).toHaveBeenCalled();
        });

        it("should not call triangle move or zoom or draw if do nothing", function(){
            expect(triangle.move).not.toHaveBeenCalled();
            expect(triangle.zoom).not.toHaveBeenCalled();
            expect(triangle.draw).not.toHaveBeenCalled();
        });

        it("should not call triangle.move when mouse is moving before mouse is down", function(){
            //mock mouse move
            expect(triangle.move).not.toHaveBeenCalled();
            expect(triangle.zoom).not.toHaveBeenCalled();
            expect(triangle.draw).not.toHaveBeenCalled();
        });

        it("should not call triangle move if mouse down but not moving", function(){
            //mock mouse down
            expect(triangle.move).not.toHaveBeenCalled();
            expect(triangle.zoom).not.toHaveBeenCalled();
            expect(triangle.draw).not.toHaveBeenCalled();
        });

        it("should call triangle.move when mouse is moving after mouse is down", function(){
            //mock mouse down and move
            //expect(triangle.move).toHaveBeenCalled();

            expect(triangle.zoom).not.toHaveBeenCalled();
            expect(triangle.draw).not.toHaveBeenCalled();

        });

        it("should not call triangle.move when mouse is moving after mouse is up", function(){
            //mock mouse up
            expect(triangle.move).not.toHaveBeenCalled();
            expect(triangle.zoom).not.toHaveBeenCalled();
            expect(triangle.draw).not.toHaveBeenCalled();

            //mock mouse move
            expect(triangle.move).not.toHaveBeenCalled();
            expect(triangle.zoom).not.toHaveBeenCalled();
            expect(triangle.draw).not.toHaveBeenCalled();
        });

        it("should call triangle.zoom when changing the mousewheel", function(){
            //mock mouse wheel
            //expect(triangle.zoom).toHaveBeenCalled();
            expect(triangle.move).not.toHaveBeenCalled();
            expect(triangle.draw).not.toHaveBeenCalled();
        });

        it("should call triangle.zoom when pressing key +", function(){
            //mock key 107

            //expect(triangle.zoom).toHaveBeenCalled();
            expect(triangle.move).not.toHaveBeenCalled();
            expect(triangle.draw).not.toHaveBeenCalled();
        });

        it("should call triangle.zoom when pressing key -", function(){
            //mock key 109

            //expect(triangle.zoom).toHaveBeenCalled();
            expect(triangle.move).not.toHaveBeenCalled();
            expect(triangle.draw).not.toHaveBeenCalled();
        });

        it("should call triangle.move when pressing key left", function(){
            //mock key 37

            //expect(triangle.move).toHaveBeenCalled();
            expect(triangle.zoom).not.toHaveBeenCalled();
            expect(triangle.draw).not.toHaveBeenCalled();
        });

        it("should call triangle.move when pressing key up", function(){
            //mock key 38

            //expect(triangle.move).toHaveBeenCalled();
            expect(triangle.zoom).not.toHaveBeenCalled();
            expect(triangle.draw).not.toHaveBeenCalled();
        });

        it("should call triangle.move when pressing key right", function(){
            //mock key 39

            //expect(triangle.move).toHaveBeenCalled();
            expect(triangle.zoom).not.toHaveBeenCalled();
            expect(triangle.draw).not.toHaveBeenCalled();
        });

        it("should call triangle.move when pressing key down", function(){
            //mock key 40

            //expect(triangle.move).toHaveBeenCalled();
            expect(triangle.zoom).not.toHaveBeenCalled();
            expect(triangle.draw).not.toHaveBeenCalled();
        });

        it("should not call triangle move or zoom or draw if press any other key", function(){
            expect(triangle.move).not.toHaveBeenCalled();
            expect(triangle.zoom).not.toHaveBeenCalled();
            expect(triangle.draw).not.toHaveBeenCalled();
        });
    });

    /*
    // demonstrates use of spies to intercept and test method calls
    it("tells the current song if the user has made it a favorite", function() {
        spyOn(song, 'persistFavoriteStatus');

        player.play(song);
        player.makeFavorite();

        expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
    });

    //demonstrates use of expected exceptions
    describe("#resume", function() {
        it("should throw an exception if song is already playing", function() {
            player.play(song);

            expect(function() {
                player.resume();
            }).toThrowError("song is already playing");
        });
    });
    */
});
