//Code ASCII OF THE MOVEMENT
const KEY_CODE_LEFT = 37;
const KEY_CODE_RIGHT = 39;
const KEY_CODE_SPACE = 32;

//Dimension of the Canvas Window
const GAME_WIDTH = 1000;
const GAME_HEIGHT = 600;

//CONSTANT POSITION OF THE PLAYER TO PREVENT THE USER CANT EXCEED THE LIMIT OF THE WIDTH OF THE SCREEN
const PLAYER_WIDTH = 20;
const PLAYER_MAX_SPEED = 800;

const LASER_MAX_SPEED = 800;
//With this paramentre we can change the velocity of shoot
const LASER_COOLDOWN = 0.1;

//This part is for the enemies
const ENEMIES_PER_ROW = 10;
const ENEMIES_HORIZONTAL_PADDING = 80;
const ENEMIES_VERTICAL_PADDING = 70;
const ENEMIES_VERTICAL_SPACING = 80;
const ENEMY_COOLDOWN = 4.0;

var enemyHit = 0;

//Functionalities for configurations

const GAME_STATE = {
    lastTime: Date.now(),
    leftPressed: false,
    rightPressed: false,
    spacePressed: false,
    playerX: 0,
    playerY: 0,
    playerCooldown: 0,
    lasers: [],
    enemies: [],
    enemyLasers: [],
    gameOver: false,
};

const audioMenu = new Audio();
audioMenu.src = "audio/music.mp3";
audioMenu.play();

function rectsIntersect(r1, r2) {
    return !(r2.left > r1.right ||
        r2.right < r1.left ||
        r2.top > r1.bottom ||
        r2.bottom < r1.top
    );
}

function main() {
    mutebutton = document.getElementById("mute");
    closebutton = document.getElementById("close");
    configurationbutton = document.getElementById("conf");

    mutebutton.addEventListener("click", muteMusic);
    closebutton.addEventListener("click", closeWindow);
    configurationbutton.addEventListener("click", showConfiguration);

    function muteMusic() {
        if (audio.muted) {
            audio.muted = false;
            mutebutton.style.background = "url(img/icon-voice.png) no-repeat";
        } else {
            audio.muted = true;
            mutebutton.style.background = "url(img/icon-mute.png) no-repeat";
        }
    }
    var verification = 1;
    function closeWindow() {
        if (verification == 1) {
            document.getElementById("configuration").style.display = "none";
        }
    }

    function showConfiguration() {
        document.getElementById("configuration").style.display = "block";
    }
    //Audio
    const $container = document.querySelector(".game");
    createPlayer($container);

    const enemySpacing = (GAME_WIDTH - ENEMIES_HORIZONTAL_PADDING * 2) /
        (ENEMIES_PER_ROW - 1);

    for (let i = 0; i < 3; i++) {
        const y = ENEMIES_VERTICAL_PADDING + i * ENEMIES_VERTICAL_SPACING;
        for (let j = 0; j < ENEMIES_PER_ROW; j++) {
            const x = j * enemySpacing + ENEMIES_HORIZONTAL_PADDING;
            createEnemy($container, x, y);
        }
    }
}

function random(min, max) {
    if (min == undefined) {
        min = 0;
    }
    if (max == undefined) {
        max = 1;
    }
    return min + Math.random() * (max - min);
}

//This is a recursivity method that call and check every frame in the game and we use that method for check every component in the game
function updateGAME() {
    const $container = document.querySelector(".game");
    const currentime = Date.now();
    const dt = (currentime - GAME_STATE.lastTime) / 1000;
    if (GAME_STATE.gameOver) {
        document.querySelector(".game-over").style.display = "block";
        audioMenu.pause();
        return;
    }

    if (playerHasWon()) {
        document.querySelector(".congratulations").style.display = "block";
        audioMenu.pause();
        return;
    }

    updatePlayer($container, dt);
    updateLasers($container, dt);
    updateEnemies($container, dt);
    updateEnemyLasers($container, dt);
    GAME_STATE.lastTime = currentime;
    window.requestAnimationFrame(updateGAME);
}


function updateLasers($container, dt) {
    const lasers = GAME_STATE.lasers;
    for (let i = 0; i < lasers.length; i++) {
        const laser = lasers[i];
        laser.y -= dt * LASER_MAX_SPEED;
        if (laser.y < 0) {
            destroyLaser($container, laser);
        }
        setPosition(laser.$element, laser.x, laser.y);
        const r1 = laser.$element.getBoundingClientRect();
        const enemies = GAME_STATE.enemies;
        for (let index = 0; index < enemies.length; index++) {
            const enemy = enemies[index];
            if (enemy.isDead) continue;
            const r2 = enemy.$element.getBoundingClientRect();
            if (rectsIntersect(r1, r2)) {
                //Enemy was hit
                destroyEnemy($container, enemy);
                destroyLaser($container, laser);
                break;
            }
        }
    }
    GAME_STATE.lasers = GAME_STATE.lasers.filter(e => !e.isDead);
}

function updateEnemies($container, dt) {
    //Calculation of the movement of the enemies ship and appears are floating
    const dx = Math.sin(GAME_STATE.lastTime / 1000.0) * 50;
    const dy = Math.cos(GAME_STATE.lastTime / 1000.0) * 50;

    const enemies = GAME_STATE.enemies;
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        const x = enemy.x + dx;
        const y = enemy.y + dy;
        setPosition(enemy.$element, x, y);
        enemy.cooldown -= dt;
        if (enemy.cooldown <= 0) {
            createEnemyLaser($container, x, y);
            enemy.cooldown = ENEMY_COOLDOWN;
        }

    }
    GAME_STATE.enemies = GAME_STATE.enemies.filter(e => !e.isDead);
}

function destroyLaser($container, laser) {
    $container.removeChild(laser.$element);
    laser.isDead = true;
}

function destroyEnemy($container, enemy) {
    $container.removeChild(enemy.$element);
    enemy.isDead = true;
}

function updatePlayer($container, dt) {
    if (GAME_STATE.leftPressed) {
        GAME_STATE.playerX -= dt * PLAYER_MAX_SPEED;
    }
    if (GAME_STATE.rightPressed) {
        GAME_STATE.playerX += dt * PLAYER_MAX_SPEED;
    }
    //This is used for regulate the velocity of shoot
    if (GAME_STATE.spacePressed && GAME_STATE.playerCooldown <= 0) {
        createLaser($container, GAME_STATE.playerX, GAME_STATE.playerY);
        GAME_STATE.playerCooldown = LASER_COOLDOWN;
    }
    //This is used for regulate the velocity of shoot
    if (GAME_STATE.playerCooldown > 0) {
        GAME_STATE.playerCooldown -= dt;
    }

    GAME_STATE.playerX = LIMITS(GAME_STATE.playerX, PLAYER_WIDTH, GAME_WIDTH - PLAYER_WIDTH);
    const player = document.querySelector(".player");
    setPosition(player, GAME_STATE.playerX, GAME_STATE.playerY);
}

function updateEnemyLasers($container, dt) {
    const lasers = GAME_STATE.enemyLasers;
    for (let i = 0; i < lasers.length; i++) {
        const laser = lasers[i];
        laser.y += dt * LASER_MAX_SPEED;
        if (laser.y > GAME_HEIGHT) {
            destroyLaser($container, laser);
        }
        setPosition(laser.$element, laser.x, laser.y);
        const r1 = laser.$element.getBoundingClientRect();
        const player = document.querySelector(".player");
        const r2 = player.getBoundingClientRect();
        if (rectsIntersect(r1, r2)) {
            //Player was hit
            destroyPlayer($container, player);
            audioMenu.pause();
            break;
        }
    }
    GAME_STATE.enemyLasers = GAME_STATE.enemyLasers.filter(e => !e.isDead);
}

//This Funcition is used for the ship can't exceed the limits
function LIMITS(limit, min, max) {
    if (limit < min) {
        return min;
    } else if (limit > max) {
        return max;
        //If the limit of the Ship not exceed the limits can pass over the window
    } else {
        return limit;
    }
}

function setPosition(el, x, y) {
    //This method is for situate the position of the ship basically
    el.style.transform = `translate(${x}px, ${y}px)`;
}

//CREATIONS

function createPlayer($container) {
    GAME_STATE.playerX = GAME_WIDTH / 2;
    GAME_STATE.playerY = GAME_HEIGHT - 50;
    const $player = document.createElement("img");
    $player.src = "img/player-blue-1.png";
    $player.className = "player";
    $container.appendChild($player);
    setPosition($player, GAME_STATE.playerX, GAME_STATE.playerY);
}

function destroyPlayer($container, player) {
    $container.removeChild(player);
    GAME_STATE.gameOver = true;
    const audio = new Audio("sound/sfx-lose.ogg");
    audio.play();
}

function playerHasWon(params) {
    return GAME_STATE.enemies.length === 0;
}

function createEnemyLaser($container, x, y) {
    const $element = document.createElement("img");
    $element.src = "img/laser-red-5.png";
    $element.className = "enemy-laser";
    $container.appendChild($element);
    const laser = { x, y, $element };
    GAME_STATE.enemyLasers.push(laser);
    setPosition($element, x, y);
}

function createLaser($container, x, y) {
    const $element = document.createElement("img");
    $element.src = "img/laser-blue-1.png";
    $element.className = "laser";
    $container.appendChild($element);
    const laser = { x, y, $element };
    GAME_STATE.lasers.push(laser);
    setPosition($element, x, y);
    const audio = new Audio("sound/sfx-laser1.ogg");
    audio.play();
}

function createEnemy($container, x, y) {
    const $element = document.createElement("img");
    $element.src = "aliens/img/shipBlue_manned.png";
    $element.className = "enemy";
    $container.appendChild($element);
    const enemy = {
        x,
        y,
        cooldown: random(0.5, ENEMY_COOLDOWN),
        $element
    };
    GAME_STATE.enemies.push(enemy);
    setPosition($element, x, y);
}

//We check if the user is clicked any key
function onKeyDown(e) {
    //Movement of left
    if (e.keyCode === KEY_CODE_LEFT) {
        GAME_STATE.leftPressed = true;
        //Movement of right
    } else if (e.keyCode === KEY_CODE_RIGHT) {
        GAME_STATE.rightPressed = true;
        //space pressed
    } else if (e.keyCode === KEY_CODE_SPACE) {
        GAME_STATE.spacePressed = true;
    }
}

//We check if the user is not cliking any key
function onKeyUp(e) {
    //Movement of left
    if (e.keyCode === KEY_CODE_LEFT) {
        GAME_STATE.leftPressed = false;
        //Movement of right
    } else if (e.keyCode === KEY_CODE_RIGHT) {
        GAME_STATE.rightPressed = false;
        //space pressed
    } else if (e.keyCode === KEY_CODE_SPACE) {
        GAME_STATE.spacePressed = false;
    }
}



main();


//I listening the keys if the user are presdsing any keys of movement
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);
window.requestAnimationFrame(updateGAME);