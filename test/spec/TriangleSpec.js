describe("Triangle", function() {
    var triangle, controller;

    var context = new Context();
    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = 400;
    const MIN_TRIANGLE_SIZE = 20;
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
        return context;
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
            spyOn(context, 'translate').and.callThrough();
            triangle = new Triangle(canvas);
        });

        it("should return correct canvas size", function() {
            this.canvas = triangle.getCanvas();
            expect(this.canvas.width).toEqual(CANVAS_WIDTH);
            expect(this.canvas.height).toEqual(CANVAS_HEIGHT);
        });

        it("should get the context by calling the method canvas.getContext with 2d", function() {
            expect(canvas.getContext).toHaveBeenCalledWith("2d");
        });

        it("should call context.translate, once, with canvas.width/2, canvas.heigth/2", function() {
            expect(context.translate).toHaveBeenCalledWith(canvas.width/2, canvas.height/2);
            expect(context.translate.calls.count()).toEqual(1);
        });

        it("should set the context style", function() {
            expect(context.strokeStyle).toEqual("#e7746f");
            expect(context.fillStyle).toEqual("#e7746f");
        });
    });

    describe("Triangle Draw", function(){
        beforeEach(function(){
            triangle = new Triangle(canvas);
        });

        it("should not call context.translate while drawing", function(){
            spyOn(context, 'translate').and.callThrough();
            triangle.draw(100);
            expect(context.translate).not.toHaveBeenCalled();
        });

        it("should call context beginPath", function(){
            spyOn(context, 'beginPath').and.callThrough();
            triangle.draw(100);
            expect(context.beginPath).toHaveBeenCalled();
		});
		
		it("should call context moveTo", function(){
            spyOn(context, 'moveTo').and.callThrough();
            triangle.draw(100);
            expect(context.moveTo).toHaveBeenCalled();
		});
		
		it("should call context lineTo", function(){
            spyOn(context, 'lineTo').and.callThrough();
            triangle.draw(100);
            expect(context.lineTo).toHaveBeenCalled();
		});
		
		it("should call context closePath", function(){
            spyOn(context, 'closePath').and.callThrough();
            triangle.draw(100);
            expect(context.closePath).toHaveBeenCalled();
		});
		
		it("should call context stroke once", function(){
            spyOn(context, 'stroke').and.callThrough();
            triangle.draw(100);
            expect(context.stroke).toHaveBeenCalled();
            expect(context.stroke.calls.count()).toEqual(1);
		});
		
		it("should call context fill", function(){
            spyOn(context, 'fill').and.callThrough();
            triangle.draw(100);
            expect(context.fill).toHaveBeenCalled();
        });
    });

    describe("Triangle move", function(){
        beforeEach(function(){
            triangle = new Triangle(canvas);
            this.moveX = 10;
            this.moveY = 10;
			
			spyOn(context, 'clearRect').and.callThrough();
            spyOn(context, 'translate').and.callThrough();
            triangle.draw(100);
            triangle.move(this.moveX, this.moveY);
            
        });

        it("should call context.clearRect", function(){
            expect(context.clearRect).toHaveBeenCalledWith(-100, -100, 200, 200);
        });

        it("should call context.translate, with moveX, moveY", function(){
            expect(context.translate.calls.count()).toEqual(1);
            expect(context.translate).toHaveBeenCalledWith(this.moveX, this.moveY);
        });

    });

    describe("Triangle zoom", function(){
        beforeEach(function(){
            triangle = new Triangle(canvas);
            spyOn(context, 'translate').and.callThrough();
            spyOn(context, 'clearRect').and.callThrough();
        });

        it("should call context.clearRect once while zooming in if the current triangle side length is larger than MIN_TRIANGLE_SIZE", function(){
            triangle.draw(100);
            triangle.zoom(10);
            expect(context.clearRect).toHaveBeenCalledWith(-100, -100, 200, 200);
            expect(context.clearRect.calls.count()).toEqual(1);
        });

        it("should call context.clearRect once while zooming out if the current triangle side length is larger than MIN_TRIANGLE_SIZE", function(){
            triangle.draw(100);
            triangle.zoom(-10);
            expect(context.clearRect).toHaveBeenCalledWith(-100, -100, 200, 200);
            expect(context.clearRect.calls.count()).toEqual(1);
        });

        it("should call context.clearRect once while zooming in if the current triangle side length is less than or equal to MIN_TRIANGLE_SIZE", function(){
            triangle.draw(20);
            triangle.zoom(1);
            expect(context.clearRect).toHaveBeenCalledWith(-20, -20, 40, 40);
            expect(context.clearRect.calls.count()).toEqual(1);
        });

        it("should NOT call context.clearRect while zooming out if the current triangle side length is less than or equal to MIN_TRIANGLE_SIZE", function(){
            triangle.draw(20);
            triangle.zoom(-1);
            expect(context.clearRect).not.toHaveBeenCalled();
        });
		
		it("should never call context.translate while zooming in or zooming out", function(){
            triangle.draw(100);
            triangle.zoom(10);
            expect(context.translate).not.toHaveBeenCalled();
            triangle.draw(100);
            triangle.zoom(-10);
            expect(context.translate).not.toHaveBeenCalled();
            triangle.draw(20);
            triangle.zoom(1);
            expect(context.translate).not.toHaveBeenCalled();
            triangle.draw(20);
            triangle.zoom(-1);
            expect(context.translate).not.toHaveBeenCalled();
		});

    });
});
