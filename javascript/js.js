window.onload = function () {
    var canvas = document.getElementById("canvas");

    var ctx = canvas.getContext("2d");
    var sound = document.getElementById("sound");
    sound.play();

    var icon = new Image();
    icon.src = 'img/nave-retro.png';
    ctx.drawImage(icon, 530, 400, 150, 100);

    startGameLoop();

    function startGameLoop(){
        setInterval(function(){
            drawScreen();
            drawShip();
        }, 16);
        window.addEventListener('keydown',movement(), true);
    }

    //function drawScreen() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#aaaaaa';
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fill();
    //}

    function drawShip(){
        ctx.drawImage(icon, x, y, 200, 103);
    }

    function movement(event) {
            if (event.keyCode == 37) {
                icon = x-=15;
            }
            if (event.keyCode == 39) {
                icon = x+=15;
            }
            if (event.keyCode == 38) {
                icon = y-=15;
            }
            if (event.keyCode == 40) {
                icon = y+=15;
            }
    }


    //https://codereview.stackexchange.com/questions/173327/space-invaders-like-game-in-javascript

    //https://www.w3schools.com/graphics/tryit.asp?filename=trygame_controllers_keys




}

/*ASCII | 38 | (Arriba) |
| 40 | (Abajo) |
| 37 | (Izqierda) |
| 39 | (Derecha) |*/