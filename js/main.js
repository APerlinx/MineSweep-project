'use strict'


const LIFE = '💓'
const NORMAL = '😀'
const DEAD = '😒'
const WON = '😎'

const gLevel = {
  SIZE: 4,
  MINES: 2,
  LIVES: 3
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
  var elModal = document.querySelector('.modal')
  elModal.style.display = 'none'
  manageLives()
  manageSmiley(NORMAL)
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

function manageSmiley(emoji){

var smiley = document.querySelector('.smiley')  
smiley.innerHTML = emoji
}

