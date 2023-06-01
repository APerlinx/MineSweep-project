'use strict'

var gBoard
const MINE = '☠️'
const FLAG = '🚩'
const EMPTY = ''


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

        }
    }
    // board[0][0].isMine = true
    // board[1][1].isMine = true
    return board
}

function renderBoard(board) {
    var strHTML = '<table><tbody>'
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const cell = board[i][j]
            const className = `cell cell-${i}-${j}`

            strHTML += `\t<td class="${className}" onclick="onCellClicked(this, ${i}, ${j})" 
                       oncontextmenu="onCellMarked(event,this,${i}, ${j})">${EMPTY}</td>\n`

        }
        strHTML += '</tr>\n'
    }
    strHTML += '</tbody></table>'


    const elContainer = document.querySelector('.board')
    elContainer.innerHTML = strHTML

}

function updateNegsCount() {

    for (var i = 0; i < gBoard.length; i++) {

        for (var j = 0; j < gBoard[0].length; j++) {
            gBoard[i][j].minesAroundCount = setMinesNegsCount(gBoard, i, j)
        }
    }
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

function onCellClicked(elCell, i, j) {

    const cell = gBoard[i][j]

    if (gGame.isOn === false) return
    if (gGame.hintIson && gFirstClick) {// For hints !
        hintReveal(gBoard, i, j)
        gGame.hintIson = false
        return
    }
    if (gGame.manuallyCreateMode) { // Manual Mode !
        manuallyCreate(elCell , i , j)
        gCountMinesforManually--
        document.querySelector('.manual span').innerHTML = gCountMinesforManually
         if (!gCountMinesforManually){
          gGame.manuallyCreateMode = false
          document.querySelector('.manual').style.display = 'none'
         }
         return
    }

    if (!cell.isMine) {
        if (cell.isShown) return
        if (cell.isMarked) return
        gGame.shownCount++
        cell.isShown = true
        elCell.classList.add('shown')
        if (!gFirstClick) manageFirstClick(i, j)
        if (cell.minesAroundCount) renderCell({ i, j }, cell.minesAroundCount, 'shown')
        else expandShown(gBoard, elCell, i, j)
    } else if (!cell.isMarked) {
        elCell.classList.add('mine')
        elCell.innerHTML = MINE
        cell.isShown = true
    }

    if(!gGame.manuallyCreateMode) checkGameOver(i, j)
    
}

function onCellMarked(event, elCell, i, j) {

    console.log('right click')
    event.preventDefault();
    if (gGame.isOn === false) return
    const cell = gBoard[i][j]


    if (cell.isShown) return
    if (cell.isMarked) {
        if (cell.isMine) gGame.markedMines--
        elCell.innerHTML = EMPTY
        cell.isMarked = false
        gGame.markedCount--
    } else {
        if (cell.isMine) gGame.markedMines++
        elCell.innerHTML = FLAG
        cell.isMarked = true
        gGame.markedCount++
    }
    checkGameOver(i, j)
}

function createMines(iOFCell, jOfCell) {
    var rows = gLevel.SIZE
    var cols = gLevel.SIZE
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            if (i === iOFCell && j === jOfCell) continue
            randMinePlacer(gLevel.SIZE, gBoard[i][j])
        }
    }
}

function expandShown(board, elCell, rowIdx, colIdx) {

    // if (board[rowIdx][colIdx] > 0) return

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= board[0].length) continue
            var currCell = board[i][j]
            if (currCell.isMine || currCell.isShown || currCell.isMarked) {
                continue
            } else {
                gGame.shownCount++
                currCell.isShown = true
                expandShown(board, elCell, i, j)
                renderCell({ i, j }, currCell.minesAroundCount, 'shown')


            }

        }

    }

}

function hintReveal(board, rowIdx, colIdx) {


    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= board[0].length) continue
            if (board[i][j].isShown) continue

            if (board[i][j].isMarked) return
            renderRevealedCell({ i, j }, i, j)
        }

    }
}

function manageFirstClick(i, j) {

    gFirstClick = true
    createMines(i, j)
    updateNegsCount()
    timer(0)
    
}

function manuallyCreate(elCell ,i, j) {
   
    elCell.innerHTML = MINE
    elCell.classList.add('mine')
    gBoard[i][j].isMine = true  
    updateNegsCount()
    gBoard[i][j].isShown = true
    setTimeout(() => {
        gBoard[i][j].isShown = false
        elCell.innerHTML = ''
        elCell.classList.remove('mine')
    }, 3000);
    
    
}

function randMinePlacer(gLevelSIZE, Currcell) {

    //Probabilty depends on the game difficulty
    // calculate proper probabilty later
    // Easy : probabilty = 10/16
    // Medium :
    // Hard :

    const probabilty = 11 / Math.pow(gLevelSIZE, 2)

    if (Math.random() > probabilty) {
        Currcell.isMine = true
        gGame.mineCount++
    }

}

function revealMines() {

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            const cell = gBoard[i][j]

            if (cell.isMine) revealMineCells({ i, j })

        }

    }

}

