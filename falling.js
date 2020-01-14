// Global Variables
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var screenHeight = 600;
var screenWidth = 400;
var shapes = {};
var shapeIndex = 0;
var dudeWidth = 80;
var dudeHeight = 80;
var dudeSrc = 'asset/b332c923997c2a98529ff4ff6189c111.png'
var ballSrc = 'asset/banhchung.png'
var score = 0;
var life = 3;
var fallSpeed = 0;
var shapeGenerateSpeed = 1500;

canvas.width = 400;
canvas.height = 600;



function itemNone(x) {
  for (var i = 0; i < x.length; i++) {
    x[i].style.display = 'none';
  }
}

function drawImages(score) {
  var item = document.querySelectorAll('.level-image__item');
  if (score <= 5) {
    itemNone(item);
    document.querySelector("#im1").style.display = 'block';
  } else if (score > 5 && score <= 10) {
    itemNone(item);
    document.querySelector("#im2").style.display = 'block';
  }
  else if (score > 10){
    itemNone(item);
    document.querySelector("#im3").style.display = 'block';
  }
}

$(document).mousemove(function(e){
  console.log()
  dude.Position.X = e.pageX - 100;
})


$(document).keydown(function(e){
    if (e.which == 37){
      dude.Velocity.X = -10;
    } else if (e.which == 39){
      dude.Velocity.X = 10;
    }
});
$(document).keyup(function(){
  dude.Velocity.X = 0;
  dude.Velocity.Y = 0;
})

//Generates Snake Head
function Shape(posX, width, height) {
    this.Width = width;
    this.Height = height;
    this.Color = "red"
    this.Position = {
        X: posX,
        Y: -this.Height
    };
    this.Velocity = Math.random() * fallSpeed + 5;
    this.Index = shapeIndex;

    shapes[shapeIndex] = this;
    shapeIndex++;

    this.checkCollisions = function() {
      if(this.Position.Y >= screenHeight){
        delete shapes[this.Index];
        life --;
        $(".life").html(life);
        if(life === 0) {
          $(".life").html('Game over');
          document.getElementById("playbutton").disabled = false;
          clearInterval();
          window.cancelAnimationFrame()
        }
      }
    }

    this.updatePosition = function() {
      this.Position.Y += this.Velocity;
    }

    this.Draw = function() {
        ctx.beginPath();
        var banhchungIcon = new Image()
        banhchungIcon.src = ballSrc
        ctx.drawImage(banhchungIcon, this.Position.X, this.Position.Y, this.Width, this.Height);
        ctx.fill();
    }

    this.update = function(){
        this.checkCollisions();
        this.updatePosition();
        this.Draw();
    }
}

function Dude(posX, width, height){
  this.Width = width;
  this.Height = height;
  this.Color = "green"
  this.Position = {X: posX, Y: screenHeight-this.Height}
  this.Velocity = {X: 0, Y: 0,}

  this.checkCollisions = function(){
    function collision(a,b){
      if (
        a.Position.X <= b.Position.X + b.Width &&
        a.Position.X + a.Width >= b.Position.X &&
        a.Position.Y + a.Height >= b.Position.Y &&
        a.Position.Y <= b.Position.Y + b.Height ){
          return true
      }
    }
    for (i in shapes){
      if(collision(this, shapes[i])){
        delete shapes[i];
        score++;
        $(".score").html(score);
        drawImages(score);
      }
    }
  }
  this.updatePosition = function(){
    this.Position.X += this.Velocity.X;
    if(this.Position.X< 0) {
      this.Position.X = 0;
    } else if(this.Position.X > 330) {
      this.Position.X = 330;
    }
    //this.Position.Y += this.Velocity.Y;
  }
  this.Draw = function(){
    ctx.beginPath();
    var dudeIcon = new Image()
    dudeIcon.src = dudeSrc
    ctx.drawImage(dudeIcon, this.Position.X, this.Position.Y, this.Width, this.Height);
    ctx.fill();
  }
  this.update = function(){
    this.checkCollisions();
    this.updatePosition();
    this.Draw();
    requestAnimationFrame(this.update);
  }
}


var dude = new Dude((screenWidth - dudeWidth)/2 , dudeWidth, dudeHeight);

function newGame(){
  dude = new Dude((screenWidth - dudeWidth)/2, dudeWidth, dudeHeight);
  shapes = {};
  score = 0;
  life = 3;
}


function shapeGenerate(){
  new Shape(Math.random()*(screenWidth - 50), 40, 40);
  setTimeout(function() { requestAnimationFrame(shapeGenerate)}, 1000);
}

function Updater() {
  ctx.clearRect(0, 0, screenWidth, screenHeight);
  for(i in shapes){
    shapes[i].update();
  }
  dude.update();
  requestAnimationFrame(Updater);
}

function render() {
  newGame()
  shapeGenerate()
  Updater()
}

function playButtonClicked() {
  render();
  document.getElementById("playbutton").disabled = true;
}
