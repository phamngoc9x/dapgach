// Global Variables
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var screenHeight = 600;
var screenWidth = 400;
var shapes = {};
var shapeIndex = 0;
var dudeWidth = 70;
var dudeHeight = 10;
var score = 0;
var life = 3;
var fallSpeed = 2;
var shapeGenerateSpeed = 1000;

canvas.width = 400;
canvas.height = 600;

$(document).mousemove(function(e){
  dude.Position.X = e.pageX;
})


$(document).keydown(function(e){
    // console.log(e.which);
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
          clearInterval(intervalUpdate);
        }
      }
    }
    this.updatePosition = function() {
      this.Position.Y += this.Velocity;

    }
    this.Draw = function() {
        ctx.beginPath();
        ctx.rect(this.Position.X, this.Position.Y, this.Width, this.Height);
        ctx.fillStyle = this.Color;
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
    ctx.rect(this.Position.X, this.Position.Y, this.Width, this.Height);
    ctx.fillStyle = this.Color;
    ctx.fill();
  }
  this.update = function(){
    this.checkCollisions();
    this.updatePosition();
    this.Draw();
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
  new Shape(Math.random()*(screenWidth - 50),30,30);
}

function Updater() {
  ctx.clearRect(0, 0, screenWidth, screenHeight);
  for(i in shapes){
    shapes[i].update();
  }
  dude.update();
}

intervalUpdate= setInterval(Updater, 10);
intervalShape= setInterval(shapeGenerate, shapeGenerateSpeed);
