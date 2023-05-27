'use strict'

var gNums
var nextNum
var time
var intervalId
var x


function onInit() {
    fontAnime()
    makeBoard()
    renderBoard()

}


function makeBoard(mode = 16) {

    gNums = []
    for (var i = 0; i < mode; i++) {
        gNums[i] = i + 1
    }

    return shuffle(gNums)

}

function renderBoard() {
    var strHTML = ''
    var currRow = 0

    for (var i = 0; i < gNums.length / Math.sqrt(gNums.length); i++) {

        strHTML += `<tr>`

        for (var j = currRow; j < currRow + Math.sqrt(gNums.length); j++) {

            strHTML += `<td onclick="cellClicked(this)" onmouseover="changeCellOnhover(this)">${gNums[j]}</td>`

        }
        strHTML += `<tr>`
        currRow += Math.sqrt(gNums.length)
    }

    document.querySelector('table').innerHTML = strHTML

}

function cellClicked(clickedNum) {

    var clock = document.querySelector('.clock')

    if (+clickedNum.innerText === 1) {
        time = 0
        clickedNum.style.backgroundColor = '#08D9D6'
        nextNum = 2
        intervalId = setInterval(() => {
            time += 0.111;
            clock.innerText = `Game time: ` + time.toFixed(3) + ` 👾 ` + `Next number:`+nextNum

        }, 100);

    }
    if (+clickedNum.innerText === nextNum) {

        clickedNum.style.backgroundColor = '#08D9D6'
        nextNum = +clickedNum.innerText + 1
        
    }

    if (+clickedNum.innerText === gNums.length && nextNum === gNums.length+1) {
        clearInterval(intervalId)
        clearInterval(x)
        clock.innerText = `Success` + `👾`
    }

}

function selectMode(elMode) {

    clearInterval(intervalId)
    makeBoard(elMode)
    renderBoard()
    if(elMode === 36){
        var arr = document.querySelectorAll('td')
        arr.forEach(element => {
            element.style.fontSize = 20 + `px`
        });
      }
      if(elMode === 25){
        var arr = document.querySelectorAll('td')
        arr.forEach(element => {
            element.style.fontSize = 25 + `px`
        });
        
      }


}

function changeCellOnhover(elCell) {

    elCell.style.color = "#787878"
    setTimeout(() => {
        elCell.style.color = ""
    }, 500);

}

function fontAnime(){


}



