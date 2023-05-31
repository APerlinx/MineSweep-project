'use strict'

const gLevel = {
  SIZE: 4,
  MINES: 2
}

const gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
  mineCount: 0,
  markedMines: 0
}



function onInit() {

  gGame.isOn = true
  gBoard = createBoard()
  renderBoard(gBoard)
  var elModal = document.querySelector('.modal')
  elModal.style.display = 'none'
  // updateNegsCount()
  console.log(gBoard)
  console.log(gGame.mineCount)
}


function checkGameOver(i, j) {

  //All mines are flagged + All possible cells are shows 

  console.log('Check gameover')

  var elModal = document.querySelector('.modal')
  const cell = gBoard[i][j]


  if (cell.isMine && cell.isShown) {
    elModal.innerHTML = 'You lost'
    elModal.style.display = 'block'
    gGame.isOn = false
  } else if (gGame.shownCount === Math.pow(gLevel.SIZE, 2) - gGame.mineCount &&
             gGame.markedMines === gGame.mineCount) {
    elModal.innerHTML = 'You WON'
    elModal.style.display = 'block'
    gGame.isOn = false
  }

}

