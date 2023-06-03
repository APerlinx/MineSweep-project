'use strict'


const LIFE = '<img src="./img/heart.gif" class="heart_img">'
const NORMAL = '<img src="./img/NORMAL.gif" class="smiley">'
const DEAD = '<img src="./img/DEAD.gif" class="smiley">'
const WON = '<img src="./img/WON.png" class="smiley">'



const gLevel = {
  SIZE: 4,
  MINES: 2,
  LIVES: 3,
  HINTS: 3,
  SAFECLICK: 3,
  MEGAHINTS: 1
}

const gGame = {
  isOn: false,
  hintIson: false,
  safeClickIson: false,
  manuallyCreateMode: false,
  megaHintIsOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
  mineCount: 0,
  markedMines: 0
}

var gFirstClick
var timerId
var hintIntervalId
var dotInterValid
var finalScore
var gCountMinesforManually
var gMoveMemoryArray
var gCountMegaHint
var gMegaHintArray

function onInit() {

  gGame.isOn = true
  gFirstClick = false
  finalScore = 0 // for Best Score task
  gCountMinesforManually = 10 // for Manually positioned mines task -> board.js
  gMoveMemoryArray = [] // for undo task
  gMegaHintArray = [] // for mega hint function
  gCountMegaHint = 2
  gBoard = createBoard()
  renderBoard(gBoard)
  manageLives()
  manageSmiley(NORMAL)
  initializeHighScore()
  saveHighScore()
  var elModal = document.querySelector('.modal')
  elModal.style.display = 'none'

  // clearStorage()
  // localStorage.clear()
}


function checkGameOver(i, j) {

  //Duplicated code, will fix later!

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
    clearInterval(timerId)
    saveHighScore(finalScore)

  }
  if (gLevel.LIVES === 0) {
    revealMines()
    elModal.innerHTML = 'You LOST'
    elModal.style.display = 'block'
    gGame.isOn = false
    manageSmiley(DEAD)
    clearInterval(timerId)
    saveHighScore(finalScore)
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
  if (gLevel.SIZE === 6) {
    gGame.manuallyCreateMode = true
    document.querySelector('.manual').style.display = 'block'
  }
  gGame.isOn = false
  restartGame()

}

function getDiffucaltyLevel() {

  if (gLevel.SIZE === 4) return "Easy"
  else if (gLevel.SIZE === 8) return "Medium"
  else if (gLevel.SIZE === 12) return "Hard"
  else if (gLevel.SIZE === 6) return "Manually"

}

function manageHints(elImg) {
console.log(elImg)
  elImg.src = './img/lightbulb2.png'
  gLevel.HINTS--
  gGame.hintIson = true

}

function safeClick() {

  if (gGame.isOn === false) return
  if (!gLevel.SAFECLICK) return

  document.querySelector('p span').innerHTML = --gLevel.SAFECLICK

  const emptyPos = getEmptyPos()
  renderCell(emptyPos, FLAG, 'coverd')

  setTimeout(() => {
    renderCell(emptyPos, '', 'coverd')
  }, 1000);

}

function mineExterminator() {

  if (gGame.isOn === false) return
  var count = 3
  for (var i = 0; i < gBoard.length; i++) {

    for (var j = 0; j < gBoard.length; j++) {

      const cell = gBoard[i][j]
      if (cell.isMine && cell.isShown === false && cell.isMarked === false) {
        if (!count) return
        cell.isMine = false
        gGame.mineCount--
        updateNegsCount()
        manageMinesCount()
        count--
      }

    }

  }

}

function manageMinesCount() {

  var minesCount = gGame.mineCount - gGame.markedMines
  var minesCountDisplay = document.querySelector('#minescount')
  minesCountDisplay.innerHTML = 'Mines:'+ minesCount

}

function undoMove() {
  // known bugs : 1.when empty cell clicked can't undo that move

  if (gMoveMemoryArray.length === 0) return
  if (gGame.isOn === false) return

  var prevMove = gMoveMemoryArray.pop()



  if (prevMove.cellIndex.isMine) {
    prevMove.cellInfo.classList.remove('mine')
    gGame.mineCount++
    gLevel.LIVES++
  } else {
    prevMove.cellInfo.classList.remove('shown')
    gGame.shownCount--

    /*
    if(!prevMove.cellIndex.minesAroundCount){
      reverseExpandShown(gBoard, prevMove.location.i, prevMove.location.j)
    }
    */

  }

  prevMove.cellIndex.isShown = false
  updateNegsCount()
  manageMinesCount()
  manageLives()
  renderCell(prevMove.location, '')

}

function timer(init = 0) {
  // needed : timer with minutes and sec 
  var sec = init;
  var clock = document.querySelector('#clock')
  timerId = setInterval(function () {
    sec += 1;
    clock.innerHTML = 'TIME:' + sec;
    finalScore++
  }, 1000);


}

function darkMode() {

  // After UI is complete

}

function manageMegaHint(location) {

  if (!gFirstClick) return
  gGame.megaHintIsOn = true
  if (!location) return
  gMegaHintArray.push(location)
  if (gMegaHintArray.length === 2) megaHint(gMegaHintArray)

}

function restartGame() {

  clearInterval(timerId)

  gGame.isOn = false
  gGame.shownCount = 0
  gGame.markedCount = 0
  gGame.secsPassed = 0
  gGame.mineCount = 0
  gGame.markedMines = 0
  gLevel.LIVES = 3
  gLevel.HINTS = 3
  gLevel.SAFECLICK = 3
  gLevel.MEGAHINTS = 1

  document.querySelector('p span').innerHTML = gLevel.SAFECLICK
  var strHTML = document.querySelector('#minescount')
  strHTML.innerHTML = 'Calculating mines'
  dotInterValid = setInterval(() => {
    strHTML.innerHTML = 'Now click on any cell'
  }, 1000);
  // Bug Alert : Hints background wont restore after restart

  onInit()

}

function saveHighScore(score) {

  var difficultyLevel = getDiffucaltyLevel()
  if (typeof (Storage) !== "undefined") {
    var existingHighScore = localStorage.getItem(difficultyLevel);
    var displayHighScore = document.querySelector('.best_score')
    if (existingHighScore === null || score > parseInt(existingHighScore)) {
      localStorage.setItem(difficultyLevel, score);
      console.log("New high score reached: " + difficultyLevel + '=>' + score);
    } else {
      console.log("Score is not higher than the existing high score.");
    }
  } else {
    console.log("Local storage is not supported.");
  }

  displayHighScore.innerHTML = 'Highscore: ' + existingHighScore

}

function initializeHighScore() {
  var difficultyLevel = getDiffucaltyLevel()
  if (typeof (Storage) !== "undefined") {
    var existingHighScore = localStorage.getItem(difficultyLevel);

    if (existingHighScore === null) {
      localStorage.setItem(difficultyLevel, 0);
    }
  } else {
    console.log("Local storage is not supported.");
  }
}



