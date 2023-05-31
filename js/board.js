'use strict'



var gBoard
const MINE = '☠️'
const FLAG = '🚩'
const EMPTY = ''



gBoard = createBoard()

renderBoard(gBoard)
updateNegsCount()
console.log(gBoard)

function updateNegsCount() {
//Update every cell.minesAroundCount to the negs around, later on make this func run only when cell clicked
    for (var i = 0; i < gBoard.length; i++) {

        for (var j = 0; j < gBoard[0].length; j++) {
            gBoard[i][j].minesAroundCount = setMinesNegsCount(gBoard, i, j)
        }
    }
}


function createBoard(rows = gLevel.SIZE, cols = gLevel.SIZE) {
    const board = []
    for (var i = 0; i < rows; i++) {
        board[i] = []
        for (var j = 0; j < cols; j++) {

            const cell = {
                minesAroundCount: 0,
                isShown: false,
                isMarked: false,
                isMine: false,
            }

            board[i][j] = cell

        //   randMinePlacer(gLevel.SIZE,cell)
        }
    }
    board[0][0].isMine = true
    board[1][1].isMine = true
    return board
}

function renderBoard(board) {
    var strHTML = '<table><tbody>'
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const cell = board[i][j]
            const className = `cell cell-${i}-${j}`
            
            strHTML += `\t<td class="${className}" onclick="onCellClicked(this, ${i}, ${j})">${EMPTY}</td>\n`

        }
        strHTML += '</tr>\n'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML

}

function setMinesNegsCount(board, rowIdx, colIdx) {

    var count = 0

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isMine) count++
        }
    }
    return count
}

function onCellClicked(elCell,i,j){

    const cell = gBoard[i][j]
    console.log('This cell info:',elCell,i,j)
    if(!cell.isMine) {
    console.log('Mines around:',cell.minesAroundCount)
    elCell.classList.add('shown')
    if(cell.minesAroundCount)  elCell.innerHTML = cell.minesAroundCount
    } else {
        elCell.classList.add('mine')
        elCell.innerHTML = MINE
    }

  }

  function randMinePlacer(gLevelSIZE,Currcell){
    
    //Probabilty depends on the game difficulty
    // Easy : 16/10  = 1.6 mines for every 10 squares, probabilty 10/16 = 0.625
    // Medium :
    //Hard :
    console.log(Math.pow(gLevelSIZE,2))
    const probabilty = 10/Math.pow(gLevelSIZE,2)

    Math.random() > probabilty ? Currcell.isMine = true : Currcell.isMine = false


  }
