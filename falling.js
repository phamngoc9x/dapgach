// Global Variables
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var screenHeight = 538;
var screenWidth = 380;
var shapes = {};
var shapeIndex = 0;
var dudeWidth = 70;
var dudeHeight = 35;
var dudeSrc = 'asset/b332c923997c2a98529ff4ff6189c111.png'
var bannerSrc = 'asset/banner1.png';
var manaSrc = 'asset/mana1.jpg';
var score = 0;
var life = 3;
var fallSpeed = 0;
var speed = 1000;
const soundTrack = document.getElementById('audio-soundtrack');
const catchSound = document.getElementById('audio-catch');
const catchFailSound = document.getElementById('audio-fail');
const gameoverSound = document.getElementById('audio-gameover');
const lvUpSound = document.getElementById('audio-lvup');
const breakpoint = [40, 80, 120, 160, 200, 240, 280, 320];
soundTrack.volume = .3;
soundTrack.loop = true;
soundTrack.playbackRate = .75;

canvas.width = 380;
canvas.height = 538;

var name = "Tran Van A";
var topScore = [
  {
    id: '1',
    score: 100,
    name: 'Nguyen Van A'
  },
  {
    id: '2',
    score: 50,
    name: 'Nguyen Van B'
  },
  {
    id: '3',
    score: 1,
    name: 'Nguyen Van C'
  }
];

function drawImages(score) {
  if (score > 40 && score <= 80) {
    manaSrc = 'asset/mana2.jpg';
    bannerSrc = 'asset/banner2.png';
    speed = 900;
    soundTrack.playbackRate = .8;
  }
  else if (score > 80 && score <= 120) {
    manaSrc = 'asset/mana3.jpg';
    bannerSrc = 'asset/banner2.png';
    speed = 800;
    soundTrack.playbackRate = .85;
  }
  else if (score > 120 && score <= 160) {
    manaSrc = 'asset/mana4.jpg';
    bannerSrc = 'asset/banner2.png';
    speed = 700;
    soundTrack.playbackRate = .9;
  }
  else if (score > 160 && score <= 200) {
    manaSrc = 'asset/mana5.jpeg';
    bannerSrc = 'asset/banner2.png';
    speed = 600;
    soundTrack.playbackRate = .95;
  }
  else if (score > 200 && score <= 240) {
    manaSrc = 'asset/mana6.jpg';
    bannerSrc = 'asset/banner2.png';
    speed = 500;
    soundTrack.playbackRate = 1;
  }
  else if (score > 240) {
    manaSrc = 'asset/mana7.jpeg';
    bannerSrc = 'asset/banner3.png';
    speed = 300;
  }
  document.querySelector('.banner').setAttribute('src', bannerSrc);
  document.querySelector('.level-image__item').setAttribute('src', manaSrc);
}

$(document).mousemove(function (e) {
  dude.Position.X = e.pageX;
})


$(document).keydown(function (e) {
  if (e.which == 37) {
    dude.Velocity.X = -10;
  } else if (e.which == 39) {
    dude.Velocity.X = 10;
  }
});
$(document).keyup(function () {
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
  this.randomItemNumber = Math.floor((Math.random() * 3) + 1);

  shapes[shapeIndex] = this;
  shapeIndex++;

    this.checkCollisions = function() {
      if(this.Position.Y >= screenHeight){
        catchFailSound.play();
        delete shapes[this.Index];
        life --;
        $(".life").html(life);
        if(life === 0) {
          soundTrack.pause();
          soundTrack.currentTime = 0;
          soundTrack.playbackRate = .7;
          $(".life").html('Game over');
          document.getElementById("playbutton").disabled = false;

        if (localStorage.getItem('topScore') == null) {
          top = localStorage.setItem('topScore', JSON.stringify(topScore));
          setScore = JSON.parse(localStorage.getItem('topScore'));
        } else {
          setScore = JSON.parse(localStorage.getItem('topScore'));
        }
        setTopScore(setScore, score, name);
      }
    }
  }

  this.updatePosition = function () {
    this.Position.Y += this.Velocity;
  }

  this.Draw = function () {
    ctx.beginPath();
    var banhchungIcon = new Image()
    banhchungIcon.src = `asset/banhchung-` + this.randomItemNumber + `.png`
    ctx.drawImage(banhchungIcon, this.Position.X, this.Position.Y, this.Width, this.Height);
    ctx.fill();
  }

  this.update = function () {
    this.checkCollisions();
    this.updatePosition();
    this.Draw();
  }
}

function Dude(posX, width, height) {
  this.Width = width;
  this.Height = height;
  this.Color = "green"
  this.Position = { X: posX, Y: screenHeight - this.Height - 20 }
  this.Velocity = { X: 0, Y: 0, }

  this.checkCollisions = function () {
    function collision(a, b) {
      if (
        a.Position.X <= b.Position.X + b.Width &&
        a.Position.X + a.Width >= b.Position.X &&
        a.Position.Y + a.Height >= b.Position.Y &&
        a.Position.Y <= b.Position.Y + b.Height ){
          catchSound.play();
          return true
      }
    }
    for (i in shapes) {
      if (collision(this, shapes[i])) {
        delete shapes[i];
        score++;
        breakpoint.forEach(elm => {
          if (score === elm) {
            lvUpSound.play();
            return
          }
        });
        $(".score").html(score);
        drawImages(score);
      }
    }
  }
  this.updatePosition = function () {
    this.Position.X += this.Velocity.X;
    if (this.Position.X < 0) {
      this.Position.X = 0;
    } else if (this.Position.X > 300) {
      this.Position.X = 300;
    }
    //this.Position.Y += this.Velocity.Y;
  }
  this.Draw = function () {
    ctx.beginPath();
    var dudeIcon = new Image()
    dudeIcon.src = dudeSrc
    ctx.drawImage(dudeIcon, this.Position.X, this.Position.Y, this.Width, this.Height);
    ctx.fill();
  }
  this.update = function () {
    this.checkCollisions();
    this.updatePosition();
    this.Draw();
    //requestAnimationFrame(this.update);
  }
}


var dude = new Dude((screenWidth - dudeWidth) / 2, dudeWidth, dudeHeight);

function newGame() {
  dude = new Dude((screenWidth - dudeWidth) / 2, dudeWidth, dudeHeight);
  shapes = {};
  score = 0;
  life = 3;
}


function shapeGenerate() {
  if (life > 0) {
    new Shape(Math.random() * (screenWidth - 50), 40, 40);
    setTimeout(function () { requestAnimationFrame(shapeGenerate) }, speed);
  }
}

function Updater() {
  ctx.clearRect(0, 0, screenWidth, screenHeight);
  for (i in shapes) {
    shapes[i].update();
  }
  dude.update();
  if (life > 0) {
    requestAnimationFrame(Updater);
  }
}

function render() {
  newGame()
  shapeGenerate()
  Updater()
}

function playButtonClicked() {
  soundTrack.play();
  life = 3;
  $(".life").html(life);
  render();
  document.getElementById("playbutton").disabled = true;
}


function setTopScore(setScore, score, name) {
  var retrievedScore = setScore;
  var top1 = retrievedScore[0].score;
  name1 = retrievedScore[0].name;
  var top2 = retrievedScore[1].score,
    name2 = retrievedScore[1].name;
  var top3 = retrievedScore[2].score,
    name3 = retrievedScore[2].name;
  if (score < top3) {
    console.log('hien diem:' + score);
  }
  else if (score < top2 && score >= top3) {
    top3 = score;
    name3 = name;
  }
  else if (score < top1 && score >= top2) {
    top2 = score;
    name2 = name;
  }
  else if (score >= top1) {
    top1 = score;
    name1 = name;
  }

  retrievedScore = [
    {
      id: '1',
      score: top1,
      name: name1
    },
    {
      id: '2',
      score: top2,
      name: name2
    },
    {
      id: '3',
      score: top3,
      name: name3
    }
  ];
  showTopScore(retrievedScore);

  localStorage.setItem('topScore', JSON.stringify(retrievedScore));
}

function showTopScore(array) {
  document.getElementById('top1').innerHTML = '<span class="top-name">' + array[0].name + '</span><span class="top-score"> ' + array[0].score + '</span>';
  document.getElementById('top2').innerHTML = '<span class="top-name">' + array[1].name + '</span><span class="top-score"> ' + array[1].score + '</span>';
  document.getElementById('top3').innerHTML = '<span class="top-name">' + array[2].name + '</span><span class="top-score"> ' + array[2].score + '</span>';
}

$(document).ready(function (e) {
  if (localStorage.getItem('topScore') == null) {
    top = localStorage.setItem('topScore', JSON.stringify(topScore));
    setScore = JSON.parse(localStorage.getItem('topScore'));
  } else {
    setScore = JSON.parse(localStorage.getItem('topScore'));
  }
  showTopScore(setScore);
});
