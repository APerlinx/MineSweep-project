'use strict'


function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
  //* The maximum is inclusive and the minimum is inclusive
}

function renderCell(location, value, className) {
  // Select the elCell and set the value
  const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
  elCell.classList.add(className)
  value ? elCell.innerHTML = value : elCell.innerHTML = ''

}



function revealMineCells(location) {
  const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
  elCell.classList.add('shown')
  elCell.innerHTML = MINE
}

function renderRevealedCell(location, i, j) {

  const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)

  if (gBoard[i][j].isMine) { //Deals with mines

    elCell.classList.add('mine')
    elCell.innerHTML = MINE
    setTimeout(() => {
      elCell.classList.remove('mine')
      elCell.innerHTML = ''
    }, 1000);

  } else { //Deals with the rest

    elCell.classList.add('shown')
    if (gBoard[i][j].minesAroundCount !== 0) {
      elCell.innerHTML = gBoard[i][j].minesAroundCount
    } else elCell.innerHTML = ''
    setTimeout(() => {
      elCell.classList.remove('shown')
      elCell.innerHTML = ''
    }, 1000);
  }


}

function clearStorage() {
  localStorage.removeItem("Easy")
  localStorage.removeItem("Medium")
  localStorage.removeItem("Hard")
}

function getEmptyPos() {
  const emptyPoss = []
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard[0].length; j++) {
      const cell = gBoard[i][j]
      if (!cell.isMine && !cell.markedCount && !cell.isShown) {
        emptyPoss.push({ i, j })
      }
    }
  }
  var randIdx = getRandomIntInclusive(0, emptyPoss.length)
  return emptyPoss[randIdx]
}