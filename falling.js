// Global Variables
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var screenHeight = 480;
var screenWidth = 500;
var shapes = {};
var shapeIndex = 0;
var dudeWidth = 70;
var dudeHeight = 35;
var dudeSrc = 'asset/bag.png';
var coreValue ='Be a team';
var manaSrc = 'asset/mana1.png';
var score = 0;
var life = 3;
var fallSpeed = 3;
var speed = 1000;
const soundTrack = document.getElementById('audio-soundtrack');
const catchSound = document.getElementById('audio-catch');
const catchFailSound = document.getElementById('audio-fail');
const lvUpSound = document.getElementById('audio-lvup');
const sounds = [soundTrack, catchSound, catchFailSound, lvUpSound];
const breakpoint = [30, 60, 90, 120, 150, 180];
soundTrack.volume = .3;
soundTrack.loop = true;
soundTrack.playbackRate = .75;
catchFailSound.volume = .7;

canvas.width = 500;
canvas.height = 480;

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
  var number = 0;
  do {
    number = Math.round(Math.random() * 10 );
  }
  while (number == 0);
  if (score < 20) {
    manaSrc = 'asset/mana1.png';
    coreValue = 'Be a team';
    speed = 1000;
    fallSpeed = 4;
    soundTrack.playbackRate = .8;
  }
  else if (score == 20 ) {
    manaSrc = 'asset/mana2.png';
    coreValue = 'Think outside the box';
    speed = 1000;
    fallSpeed = 6;
    soundTrack.playbackRate = .8;
  }
  else if (score == 40 ) {
    manaSrc = 'asset/mana'+ number +'.png';
    coreValue = 'Get risky';
    speed = 900;
    fallSpeed = 8;
    soundTrack.playbackRate = .85;
  }
  else if (score == 60 ) {
    manaSrc = 'asset/mana'+ number +'.png';
    coreValue = 'Be optimistic';
    speed = 800;
    soundTrack.playbackRate = .9;
    fallSpeed = 10;
  }
  else if (score == 80) {
    manaSrc = 'asset/mana'+ number +'.png';
    coreValue = 'Go fast';
    speed = 700;
    soundTrack.playbackRate = .95;
    fallSpeed = 12;
  }
  else if (score == 100) {
    manaSrc = 'asset/mana'+ number +'.png';
    coreValue = 'Be professional';
    speed = 600;
    soundTrack.playbackRate = 1;
    fallSpeed = 14;
  }
  else if (score == 120) {
    manaSrc = 'asset/mana'+ number +'.png';
    coreValue = 'Stay focused';
    speed = 500;
    soundTrack.playbackRate = 1;
    fallSpeed = 16;
  }
  else if (score == 140) {
    manaSrc = 'asset/mana'+ number +'.png';
    coreValue = 'Be a team';
    speed = 400;
    soundTrack.playbackRate = 1;
    fallSpeed = 18;
  }
  else if (score == 160) {
    manaSrc = 'asset/mana'+ number +'.png';
    coreValue = 'Think outside the box';
    speed = 300;
    soundTrack.playbackRate = 1;
    fallSpeed = 20;
  }
  else if (score == 180) {
    manaSrc = 'asset/mana'+ number +'.png';
    coreValue = 'Get risky';
    fallSpeed = 22;
    speed = 200;
  }
  document.querySelector('.slogan').innerHTML = coreValue;
  document.querySelector('.level-image__item').setAttribute('src', manaSrc);
}


$(document).mousemove(function (e) {
  dude.Position.X = e.pageX - (($(window).width() - 750)/2);
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

  this.checkCollisions = function () {
    if (this.Position.Y >= screenHeight) {
      catchFailSound.pause();
      catchFailSound.currentTime = 0;
      catchFailSound.play();
      delete shapes[this.Index];
      life--;
      $(".life").html(life);
      if (life === 0) {
        soundTrack.pause();
        soundTrack.currentTime = 0;
        $(".life").html('Game over');
        $('.result-board').addClass('show');
        document.getElementById("playbutton").disabled = false;

        if (localStorage.getItem('topScore') == null) {
          top = localStorage.setItem('topScore', JSON.stringify(topScore));
          setScore = JSON.parse(localStorage.getItem('topScore'));
        } else {
          setScore = JSON.parse(localStorage.getItem('topScore'));
        }
        addRecord({ name: document.querySelector('.form-regis input').value, score });
        // setTopScore(setScore, score, name);
      }
    }
  }

  this.updatePosition = function () {
    this.Position.Y += fallSpeed;
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
        a.Position.Y <= b.Position.Y + b.Height) {
        catchSound.pause();
        catchSound.currentTime = 0;
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
    } else if (this.Position.X > 430) {
      this.Position.X = 430;
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

$('#playbutton').on('click', function (e) {
  e.preventDefault();
  const fieldName = $('.form-regis input');
  if (fieldName.val().trim() !== '') {
    $('.info-user').addClass('d-block');
    $('.info-user .name').text(fieldName.val().trim());
    $('.form-regis').addClass('d-none');
    soundTrack.play();
    life = 3;
    $(".life").html(life);
    render();
  } else {
    $('.form-regis .mess-error').addClass('d-block');
  }
});

function replay() {
  $('.result-board').removeClass('show');
  fallSpeed = 5;
  speed = 1000;
  soundTrack.playbackRate = .75;
  setTimeout(function () {
    soundTrack.play();
    life = 3;
    score = 0;
    $(".score").html(score);
    drawImages(score);
    $(".life").html(life);
    render();
  }, 1000)
}

$('#replay-button').on('click', function () {
  replay()
});

window.onkeypress = function(e) {
  if (e.keyCode === 13 && document.querySelector('.result-board.show #replay-button')) {
    replay()
  }

  if (e.keyCode === 90 && e.shiftKey) {
    if ($('.sound-control .sound-on').hasClass('d-block')) {
      soundOff()
    } else {
      soundOn()
    }
  }
};

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
  for (let i = 0; i <= 2; i++) {
    document.querySelector('#top' + (i + 1) + ' .top-name').innerHTML = array[i].name;
    document.querySelector('#top' + (i + 1) + ' .top-score').innerHTML = array[i].score;
  }
}

function soundOff() {
  $('.sound-on').removeClass('d-block').addClass('d-none');
  $('.sound-off').removeClass('d-none').addClass('d-block');
  sounds.forEach(sound => sound.muted = true)
}

function soundOn() {
  $('.sound-on').removeClass('d-none').addClass('d-block');
  $('.sound-off').removeClass('d-block').addClass('d-none');
  sounds.forEach(sound => sound.muted = false)
}

$('.sound-on').on('click', function () {
  soundOff()
});

$('.sound-off').on('click', function () {
  soundOn()
});

$('.js-click-to-play-btn').on('click', function() {
  $('.info-page').addClass('hide')
});

$('.js-show-info-page-btn').on('click', function() {
  $('.info-page').removeClass('hide')
})

$(document).ready(function (e) {
  // if (localStorage.getItem('topScore') == null) {
  //   top = localStorage.setItem('topScore', JSON.stringify(topScore));
  //   setScore = JSON.parse(localStorage.getItem('topScore'));
  // } else {
  //   setScore = JSON.parse(localStorage.getItem('topScore'));
  // }

  subscribeScores(scores => {
    showTopScore(scores)
  })

});
