const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const pointsDOM = document.getElementById('points');
const lifeDOM = document.getElementById('life');
const timeDOM = document.getElementById('time');

const snakeHeadUp = new Image();
snakeHeadUp.src = "img/snake-head-up.png";
const snakeHeadDown = new Image();
snakeHeadDown.src = "img/snake-head-down.png";
const snakeHeadLeft = new Image();
snakeHeadLeft.src = "img/snake-head-left.png";
const snakeHeadRight = new Image();
snakeHeadRight.src = "img/snake-head-right.png";

let fruitPickSound = new Audio('sounds/fruitPick.wav');
let lifeLossSound = new Audio('sounds/lifeLoss.wav');

let snakeHead = snakeHeadUp;

const snakeBody = new Image();
snakeBody.src = "img/snake-body.png";
const apple = new Image();
apple.src = "img/apple.png";

let objectSize = 15;

const boardWidth = 50;
const boardHeight = 35;

canvas.width = boardWidth*objectSize;
canvas.height = boardHeight*objectSize;

canvas.addEventListener('keypress', snakeDirection);

const cw = canvas.width;
const ch = canvas.height;

let snakeStartLength = 4;
let gameSpeed = 200;
let snakeX = Math.floor(cw/objectSize/2)*objectSize;
let snakeY = Math.floor(ch/objectSize/2)*objectSize;
let direction = 'up';
let fruitX, fruitY;
let snakeBlocks = [];
let points = 0;
let life = 3;
let timer;

let gameMin = 0, gameSec = 0;

let moveAccepted = true;
let key = null;

newFruit();
drawFrame();


setInterval(countTime, 1000);

function drawFrame() {
    drawBoard();
    blockWSAD = true;
    drawSnake();
    blockWSAD = false;
    drawFruits();
    timer = setTimeout(drawFrame, gameSpeed);
}

function countTime() {
    gameSec += 1;
    if(gameSec >= 60) {
        gameSec = 0;
        gameMin += 1;
    }

    let gameTime = "";

    if(gameMin < 10)
        gameTime += "0";
    gameTime += gameMin + ":";
    if(gameSec < 10)
        gameTime += "0";
    gameTime += gameSec;

    timeDOM.innerHTML = gameTime;
}

function gameReset() {
    lifeLossSound.play();
    gameSpeed = 200;
    snakeX = Math.floor(cw/objectSize/2)*objectSize;
    snakeY = Math.floor(ch/objectSize/2)*objectSize;
    direction = 'up';
    snakeBlocks = [];
    snakeHead = snakeHeadUp;
    snakeStartLength = points + snakeStartLength;

    life -= 1;
    if(life <= 0)
    {
        gameMin = 0, gameSec = -1;
        points = 0;
        life = 3;
        countTime();
        newFruit();
    }

    pointsDOM.innerHTML = points;
    lifeDOM.innerHTML = life;
}

function drawSnake() {
    ctx.fillStyle = "#ffffff";

    if(direction == 'left') // Left
        snakeX -= objectSize;
    else if(direction == 'right') // Right
        snakeX += objectSize;    
    else if(direction == 'up') // Up
        snakeY -= objectSize;    
    else if(direction == 'down') // Down
        snakeY += objectSize;

    if(snakeX < 0 || snakeY < 0 || snakeX > cw - objectSize || snakeY > ch - objectSize || snakeBlocks.findIndex(i => (i[0] === snakeX && i[1] === snakeY)) != -1) {
        gameReset();       
        return;
    }

    moveAccepted = true;

    if((snakeX != fruitX || snakeY != fruitY) && snakeBlocks.length >= snakeStartLength) {
        snakeBlocks.pop();
    }
    else if(snakeX == fruitX && snakeY == fruitY) {
        fruitPickSound.play();
        points += 1;
        pointsDOM.innerHTML = points;
        newFruit();
        if(gameSpeed > 70)
            gameSpeed -= 5;
    }

    snakeBlocks.unshift([snakeX, snakeY]);

    snakeBlocks.forEach(function(el, index, array) {
        if(index == 0) {
            ctx.drawImage(snakeHead, el[0], el[1], objectSize, objectSize);
        }
        else {
            ctx.drawImage(snakeBody, el[0], el[1], objectSize, objectSize);
        }

    });

    if(key !== null)
        snakeDirection(key);
}

function snakeDirection(e) {
    key = null;
    if((e.charCode == 97 || e.charCode == 65) && direction != 'right' && moveAccepted) {
        direction = 'left';
        snakeHead = snakeHeadLeft;
        key = e;
    } 
    else if((e.charCode == 100 || e.charCode == 68) && direction != 'left' && moveAccepted) {
        direction = 'right';
        snakeHead = snakeHeadRight;
        key = e;
    } 
    else if ((e.charCode == 119 || e.charCode == 87) && direction != 'down' && moveAccepted) {
        direction = 'up'; 
        snakeHead = snakeHeadUp;
        key = e;
    }
    else if ((e.charCode == 115 || e.charCode == 83) && direction != 'up' && moveAccepted) {
        direction = 'down';
        snakeHead = snakeHeadDown;
        key = e;
    }
    moveAccepted = false;
}

function drawFruits() { 
    ctx.drawImage(apple, fruitX, fruitY, objectSize, objectSize);
} 

function newFruit() {
    fruitX = Math.floor((Math.random() * boardWidth)) * objectSize;
    fruitY = Math.floor((Math.random() * boardHeight)) * objectSize;
    snakeBlocks.forEach(function(el, index, array) {
        if(fruitX == el[0] && fruitY == el[1]) {
            newFruit();
        }
    });
}

function drawBoard() {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, cw, ch);
}