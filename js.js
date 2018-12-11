let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');

let fonImage = new Image();
fonImage.src = 'fon.png';

let asterImg = new Image();
asterImg.src = 'astero.png';

let shipImg = new Image();
shipImg.src = 'ship01.png';

let fireImg = new Image();
fireImg.src = 'fire.png';

let bangsImg = new Image();
bangsImg.src = 'expl222.png';

let shieldImg = new Image();
shieldImg.src = 'https://banner2.kisspng.com/20180528/liv/kisspng-green-shield-canada-clip-art-shield-clipart-5b0be532382e08.0549832415275062262301.jpg';

let shieldImg2 = new Image();
shieldImg2.src = 'shield.png';

let shieldArray = [];
let fireArray = [];
let aster = [];
let bangs = [];
let timer = 0;
let score = 0;
let timerShield = 0;
let timeShield = 0;

let ship = {
  positionX: 300,
  positionY: 300,
  animX: 0,
  animY: 0
};

let gameEnd = false;
let takenShiled = false;

function game() {
  if (!gameEnd) {
    getArrayOnAster();
    console.log(aster);
    getArrayOnFire();
    getArrayOnShield()
    update();
    render();
    nextGameStep(game);
  } else {
    drawGameOver();
  }
}

function update() {
  setMotionToAsteroids();
  setMotionToFires();
  setAnimationOnBangs();
  setMotionToShield();
  setAnimationOnShield();
  toGiveTimeToTheShield();
}

function setMotionToShield() {
  for (i in shieldArray) {
    shieldArray[i].positionX += shieldArray[i].offsetX;
    shieldArray[i].positionY += shieldArray[i].offsetY;

    if (shieldArray[i].positionX >= 550 || shieldArray[i].positionX < 0) shieldArray[i].offsetX = -shieldArray[i].offsetX;

    if (Math.abs((ship.positionX < shieldArray[i].positionX + 40) &&
        (ship.positionX + 40 > shieldArray[i].positionX) &&
        (ship.positionY < shieldArray[i].positionY + 30) &&
        (ship.positionY + 30 > shieldArray[i].positionY))) {
          shieldArray.splice(i, 1);
          takenShiled = true;
        }
  }
}

function toGiveTimeToTheShield() {
  if (takenShiled) {
    timeShield++;
  }
  if (timeShield == 700) {
    takenShiled = false;
    timeShield = 0;
  }
}


function getArrayOnShield() {
  timerShield++;
    if (timerShield == 900) {
      timerShield = 0;
      shieldArray.push({positionX: Math.random()*600,
                  positionY: -50,
                  offsetX: Math.random()*2-1,
                  offsetY: Math.random()*2+2,
                  del: 0})
    }
}

function getArrayOnAster() {
  timer++;
    if(timer%10 == 0) {
      aster.push({positionX: Math.random()*600,
                positionY: -50,
                offsetX: Math.random()*2-1,
                offsetY: Math.random()*2+2,
                del: 0});
  }
}

function getArrayOnFire() {
  if (timer%20 ==0) {
    fireArray.push({positionX: ship.positionX,
                    positionY: ship.positionY,
                    offsetX: 0,
                    offsetY: -5
    });
  }
}

function setAnimationOnBangs() {
  for (i in bangs) {
    bangs[i].animX = bangs[i].animX + 0.5;
      if (bangs[i].animX > 7) {
        bangs[i].animY++;
        bangs[i].animX = 0;
      }
      if (bangs[i].animY > 7) {
        bangs.splice(i, 7);
      }
  }
}

function setAnimationOnShield() {
  ship.animX++;

  if (ship.animX > 4) {
    ship.animY++;
    ship.animX = 0;
  }

  if (ship.animY > 3) {
    ship.animX = 0;
    ship.animY = 0;
  }
}

function setMotionToFires() {
  for (i in fireArray) {
    fireArray[i].positionY += fireArray[i].offsetY;

      if(fireArray[i].positionY < -30) fireArray.splice(i,1);
  }
}

function setMotionToAsteroids() {
  for (i in aster) {
    aster[i].positionX += aster[i].offsetX;
    aster[i].positionY += aster[i].offsetY;

      if (aster[i].positionX >= 550 || aster[i].positionX < 0) aster[i].offsetX = -aster[i].offsetX;
      if (aster[i].positionY >= 600) aster.splice(i, 1);

      for (j in fireArray) {
        if (Math.abs(aster[i].positionX + 25 - fireArray[j].positionX) < 50 && Math.abs(aster[i].positionY - fireArray[j].positionY) < 25) {
          bangs.push({positionX: aster[i].positionX - 25,
                    positionY: aster[i].positionY - 25,
                    animX: 0,
                    animY: 0
          });

          aster[i].del = 1;
          fireArray.splice(i, 1);
          break;
      }
    }
    getCollisionWithAsteroids();
  }
}

function getCollisionWithAsteroids() {
  if (!takenShiled) {
    if (Math.abs((ship.positionX < aster[i].positionX + 40) &&
        (ship.positionX + 40 > aster[i].positionX) &&
        (ship.positionY < aster[i].positionY + 30) &&
        (ship.positionY + 30 > aster[i].positionY))) {
          gameEnd = true;
  }
}
  if (aster[i].del == 1) {
    aster.splice(i, 1);
    score +=25;
  }
}

function render() {
  drawBackgroundAndShip();
  drawFires();
  drawAsteroids();
  drawBangs();
  drawShield();
  drawScore();
  drawAnimationShield();
}

function drawBackgroundAndShip() {
  context.drawImage(fonImage, 0, 0, 600, 600);
  context.drawImage(shipImg, ship.positionX, ship.positionY, 50, 30);
}

function drawFires() {
  for (i in fireArray) {
    context.drawImage(fireImg, fireArray[i].positionX, fireArray[i].positionY, 30, 30);
  }
}

function drawAsteroids() {
  for (i in aster) {
    context.save();
    context.translate(aster[i].positionX + 25, aster[i].positionY + 25);
    context.rotate(aster[i].angle);
    context.drawImage(asterImg, -25, -25, 50, 50);
    context.restore();
  }
}

function drawBangs() {
  for (i in bangs) {
    context.drawImage(bangsImg, 128*Math.floor(bangs[i].animX), 128*Math.floor(bangs[i].animY), 128, 128, bangs[i].positionX, bangs[i].positionY, 100, 100);
  }
}

function drawShield() {
  for (i in shieldArray) {
    context.drawImage(shieldImg, shieldArray[i].positionX, shieldArray[i].positionY, 50, 50);
  }
}

function drawScore() {
  context.strokeStyle = "#F00";
  context.font = "italic 20pt Arial";
  context.strokeText('Score: ' + score, 430, 40);
}

function drawAnimationShield() {
  if (takenShiled) {
    context.drawImage(shieldImg2, 192*Math.floor(ship.animX),192*Math.floor(ship.animY),192,192, ship.positionX-25, ship.positionY-25, 100, 100);
  }
}

function drawGameOver() {
  context.fillStyle = "#F00";
  context.font = "italic 30pt Arial";
  context.fillText('GAME OVER', 170, 200);
  context.font = "italic 15pt Arial";
  context.fillText('Чтобы начать сначала обновите страницу!', 90, 230);
}

function getEventCanvas() {
  canvas.addEventListener("mousemove", function (event) {
    ship.positionX = event.offsetX;
    ship.positionY = event.offsetY;
  });
}

let nextGameStep = (function (){
  return  requestAnimationFrame ||//Создает анимацию полета не рабоатет для всех браузеров
    webkitRequestAnimationFrame ||//Если возвращать команду, то передастся тело а не результат, поэтому нужно свмовызвать функцию
    mozRequestAnimationFrame    ||
    oRequestAnimationFrame      ||
    msRequestAnimationFrame     ||
    function (callBack){
        setTimeout(callBack, 100/60);
    };
})();

window.onload = function () {
  game();
  getEventCanvas();
}
