'use strict'


const LIFE = '💓'
const NORMAL = '😀'
const DEAD = '😒'
const WON = '😎'


const gLevel = {
  SIZE: 4,
  MINES: 2,
  LIVES: 3,
  HINTS: 3
}

const gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
  mineCount: 0,
  markedMines: 0
}

var gFirstClick


function onInit() {

  gGame.isOn = true
  gFirstClick = false
  gBoard = createBoard()
  renderBoard(gBoard)
  manageLives()
  manageSmiley(NORMAL)

  var elModal = document.querySelector('.modal')
  elModal.style.display = 'none'
}


function checkGameOver(i, j) {

  //All mines are flagged + All possible cells are showns 

  console.log('Check gameover')

  var elModal = document.querySelector('.modal')
  const cell = gBoard[i][j]

  if (cell.isMine && cell.isShown) {
    gLevel.LIVES--
    manageLives()
  }
  if (gGame.shownCount === Math.pow(gLevel.SIZE, 2) - gGame.mineCount) {
    elModal.innerHTML = 'You WON'
    elModal.style.display = 'block'
    gGame.isOn = false
    manageSmiley(WON)

  }
  if (gLevel.LIVES === 0) {
    elModal.innerHTML = 'You lost'
    elModal.style.display = 'block'
    gGame.isOn = false
    manageSmiley(DEAD)
  }

}

function manageLives() {

  var livesHTML = 'Lives: '

  for (var i = 0; i < gLevel.LIVES; i++) {
    livesHTML += LIFE
  }

  document.querySelector('.lives').innerHTML = livesHTML

}

function manageSmiley(emoji) {

  var smiley = document.querySelector('.smiley')
  smiley.innerHTML = emoji
}

function manageDifficulty(elBtn) {

  gLevel.SIZE = elBtn
  resetStats()
  onInit()

}

function resetStats() {

  gGame.shownCount = 0
  gGame.markedCount = 0
  gGame.secsPassed = 0
  gGame.mineCount = 0
  gGame.markedMines = 0
  gLevel.LIVES = 3
  clearInterval(timer)

}

function hints(elImg) {

  console.log('hint function is in progress')

  elImg.style.backgroundColor = '#111'
  gLevel.HINTS--

}


function timer() {
  //crappy timer need to improve
  var sec = 0;
  var timer = setInterval(function () {
    document.querySelector('.clock').innerHTML = sec.toFixed(2);
    sec += 1;
  }, 1000);
}
