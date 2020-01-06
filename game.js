var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var x = 20, y = 20;
var dx = 5, dy = 2;
var radius = 20;

var paddle = {
  width: 70,
  height: 10,
  x: 0,
  y: canvas.height - 30,
  speed: 10,
  isMovingLeft: false,
  isMovingRight: false,
}

document.addEventListener('keyup', function(event){
  console.log('key up')
  console.log(event)

  if(event.keyCode == 37) {

    paddle.isMovingLeft = false;
    //paddle.x -=paddle.speed;
  }
  else if(event.keyCode == 39) {
    paddle.isMovingRight = false;
    // paddle.x +=paddle.speed;
  }
})
document.addEventListener('keydown', function(event){
  console.log('key down')
  console.log(event)

  if(event.keyCode == 37) {
    paddle.isMovingLeft = true;
    //paddle.x -=paddle.speed;
  }
  else if(event.keyCode == 39) {
    paddle.isMovingRight = true;
    // paddle.x +=paddle.speed;
  }
})

function drawBall() {
    context.beginPath()
    context.arc(x, y, radius, 0, 2* Math.PI, false);
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



function handleBall() {
  if(x < radius || x > canvas.width - radius) {
    dx = -dx;
  }
  if(y < radius || y > canvas.height - radius) {
    dy = -dy;
  }
}

function updateBallPosition() {
  x += dx;
  y += dy;
}



function draw() {
  context.clearRect(0,0, canvas.clientWidth, canvas.clientHeight);
    //draw ball
  drawBall();
  drawPaddle();

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

  handleBall();
  updateBallPosition();
    
  requestAnimationFrame(draw);
}

draw();