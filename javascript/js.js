window.onload = function () {
    var myGamePiece;

    function startGame() {
        myGameArea.start();
        myGamePiece = new component(150, 150, "img/nave-retro.png", 450, 390, "image");
    }

    var myGameArea = {
        canvas: document.createElement("canvas"),
        start: function () {
            this.canvas.width = 1000;
            this.canvas.height = 500;
            this.context = this.canvas.getContext("2d");
            document.body.insertBefore(this.canvas, document.body.childNodes[0]);
            this.interval = setInterval(updateGameArea, 20);
            window.addEventListener('keydown', function (e) {
                myGameArea.key = e.keyCode;
            })
            window.addEventListener('keyup', function (e) {
                myGameArea.key = false;
            })
        },
        clear: function () {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    function component(width, height, route, x, y, type) {
        this.type = type;
        if (type == "image") {
            this.image = new Image();
            this.image.src = route;
        }
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;    
        this.x = x;
        this.y = y;    
        this.update = function() {
            ctx = myGameArea.context;
            if (type == "image") {
                ctx.drawImage(this.image, 
                    this.x, 
                    this.y,
                    this.width, this.height);
            } else {
                ctx.fillStyle = route;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        }
        this.newPos = function() {
            this.x += this.speedX;
            this.y += this.speedY;        
        }
    }

    function updateGameArea() {
        myGameArea.clear();
        myGamePiece.speedX = 0;
        myGamePiece.speedY = 0;
        if (myGameArea.key && myGameArea.key == 37) { myGamePiece.speedX = -5; }
        if (myGameArea.key && myGameArea.key == 39) { myGamePiece.speedX = 5; }
        if (myGameArea.key && myGameArea.key == 38) { myGamePiece.speedY = -5; }
        if (myGameArea.key && myGameArea.key == 40) { myGamePiece.speedY = 5; }
        myGamePiece.newPos();
        myGamePiece.update();
    }

    startGame();


    //https://codereview.stackexchange.com/questions/173327/space-invaders-like-game-in-javascript

    //https://www.w3schools.com/graphics/tryit.asp?filename=trygame_controllers_keys




}

/*ASCII | 38 | (Arriba) |
| 40 | (Abajo) |
| 37 | (Izqierda) |
| 39 | (Derecha) |*/