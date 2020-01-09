var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var ball = {
  x: 200,
  y: 200,
  dx: 5,
  dy: 2,
  radius: 10,
}

var paddle = {
  width: 70,
  height: 10,
  x: 0,
  y: canvas.height - 10,
  speed: 10,
  isMovingLeft: false,
  isMovingRight: false,
}

var gameLife = 3;
var gameScore = 0;

var brickConfig = {
  offsetX: 25,
  offsetY: 25,
  margin: 25,
  width: 70,
  height: 15,
  totalRow: 3,
  totalCol: 5
}

var brickList = [];

for(var i = 0; i < brickConfig.totalRow; i++) {
  for(var j = 0; j < brickConfig.totalCol; j++) {
    brickList.push({
      x: brickConfig.offsetX + j * (brickConfig.width + brickConfig.margin),
      y: brickConfig.offsetY + i * (brickConfig.height + brickConfig.margin),
      isBroken: false
    })
  }
}



document.addEventListener('keyup', function(event){

  if(event.keyCode == 37) {

    paddle.isMovingLeft = false;
  }
  else if(event.keyCode == 39) {
    paddle.isMovingRight = false;
  }
})
document.addEventListener('keydown', function(event){

  if(event.keyCode == 37) {
    paddle.isMovingLeft = true;
  }
  else if(event.keyCode == 39) {
    paddle.isMovingRight = true;
  }
})

function drawScore(score) {
  context.beginPath();
  context.rect(10, 10, 10, 10);
  context.fillText(score, canvas.width - 30, canvas.height - 30);
  context.font = "20px Georgia";
  context.fillStyle = 'transparent';
  context.fill();
  context.closePath();
}

function drawImages(score) {
  context.beginPath();
  context.rect(40, 40, 40, 40);
  if (score <= 2) {
    var img = document.getElementById("im1");
  } else {
    var img = document.getElementById("im2");
  }
  context.drawImage(img,canvas.width - 100, canvas.height - 100,40,40);
  context.fillStyle = 'transparent';
  context.fill();
  context.closePath();
}

function drawBall() {
    context.beginPath()
    context.arc(ball.x, ball.y, ball.radius, 0, 2* Math.PI, false);
    context.fillStyle = 'red';
    context.fill();
    context.closePath()
}

function drawPaddle() {
    context.beginPath()
    context.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    context.fillStyle = 'red';
    context.fill();
    context.closePath()
}

function drawBricks() {
  brickList.forEach(function(b){
    if(b.isBroken ==false) {
      context.beginPath();
      context.rect(b.x, b.y, brickConfig.width, brickConfig.height);
      context.fill();
      context.closePath();
    }

  })

}

function handleBall() {
  if(ball.x < ball.radius || ball.x > canvas.width - ball.radius) {
    ball.dx = -ball.dx;
  }
  if(ball.y < ball.radius || ball.y > canvas.height - ball.radius) {
    ball.dy = -ball.dy;
  }
}

function updateBallPosition() {
  ball.y += -ball.dy;
}

function handleBallPaddle() {
  if(ball.x + ball.radius >= paddle.x &&  ball.x + ball.radius <= paddle.x + paddle.width && ball.y + ball.radius>= canvas.height-paddle.height){
    ball.dx = -ball.dx;
    ball.dy = -ball.dy;
    gameScore = gameScore + 1;
    console.log('score ' + gameScore);
  }
  drawScore(gameScore);
  drawImages(gameScore);
}

function handleBallBrick() {
  brickList.forEach(function(b) {
    if(!b.isBroken) {
      if(ball.x >= b.x && ball.x <=b.x + brickConfig.width &&
        ball.y + ball.radius >= b.y && ball.y - ball.radius <= b.y + brickConfig.height) {
        ball.dy = -ball.dy;
        b.isBroken = true;
      }
    }
  })
}

function updatePaddlePosition() {
  if(paddle.isMovingLeft) {
    paddle.x -=paddle.speed;
  }
  else if(paddle.isMovingRight) {
    paddle.x +=paddle.speed;
  }

  if(paddle.x < 0) {
    paddle.x = 0;
  } else if(paddle.x > canvas.width - paddle.width) {
    paddle.x = canvas.width - paddle.width;
  }
}

function checkGameLife() {
  if(ball.y > canvas.height - ball.radius) {
    gameLife = gameLife - 1;
    console.log('game life' + gameLife);
  }
}


function draw() {
  if(gameLife <= 3 && gameLife > 0) {
    context.clearRect(0,0, canvas.clientWidth, canvas.clientHeight);
    drawBall(ball.x,ball.y);
    drawPaddle();
    drawBricks();
    drawScore(gameScore);

    handleBall();
    handleBallPaddle();
    handleBallBrick();

    updateBallPosition();
    updatePaddlePosition();
    checkGameLife();

    requestAnimationFrame(draw);
  } else if(gameLife === 0) {
    console.log('game over');
  }
}

draw();
