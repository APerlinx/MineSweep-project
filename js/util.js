'use strict'


function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
    //* The maximum is inclusive and the minimum is inclusive
  }

  // location is an object like this - { i: 2, j: 7 }
function renderCell(location) {
  // Select the elCell and set the value
  const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
  elCell.classList.add('shown')
}
  