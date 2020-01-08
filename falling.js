// Global Variables
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var screenHeight = 600;
var screenWidth = 600;
var shapes = {};
var shapeIndex = 0;
var score = 0;
var life = 3;
var fallSpeed = 2;
var shapeGenerateSpeed = 1000;

canvas.width = 600;
canvas.height = 600;

// $(document).mousemove(function(e){
//   dude.Position.X = e.pageX;
//   dude.Position.Y = e.pageY;
// })

$(document).keydown(function(e){
    // console.log(e.which);
    if (e.which == 65){
      dude.Velocity.X = -5;
    } else if (e.which == 87){
      dude.Velocity.Y = -5;
    } else if (e.which == 68){
      dude.Velocity.X = 5;
    } else if (e.which == 83){
      dude.Velocity.Y = 5;
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
    shapeIndex++

    this.checkCollisions = function() {
      if(this.Position.Y >= screenHeight){
        delete shapes[this.Index];
        life --
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
    this.Position.Y += this.Velocity.Y;
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


var dude = new Dude(screenWidth/2, 70, 10);

function newGame(){
  dude = new Dude(screenWidth/2, 70, 10);
  shapes = {};
  score = 0;
  life = 3;
}


function shapeGenerate(){
  new Shape(Math.random()*screenWidth,30,30);
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

