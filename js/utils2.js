'use strict'

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getRandomEmptyCellPosition(rowLength, colLength) {
    const emptyCells = []
    for (var i = 0; i < rowLength; i++) {
        for (var j = 0; j < colLength; j++) {
            const cell = gBoard[i][j]
            if (cell.gameObject === null && cell.type === SKY) {
                emptyCells.push({ i, j })
            }
        }
    }

    if (!emptyCells.length) return null

    const randIdx = getRandomInt(0, emptyCells.length)
    return emptyCells[randIdx]
}

// get diagonal
function printPrimaryDiagonal(mat) {
    for (var d = 0; d < mat.length; d++) {
        var currItem = mat[d][d]
        console.log(currItem)
    }
}
// get diagonal
function printScondaryDiagonal(mat) {
    for (var d = 0; d < mat.length; d++) {
        var currItem = mat[d][mat.length - d - 1]
        console.log(currItem)
    }
}

// get random item from array
function getRandomItem(arr) {

    // get random index value
    const randomIndex = Math.floor(Math.random() * arr.length);

    // get random item
    const item = arr[randomIndex];

    return item;
}

//create matrix
function createMat(ROWS, COLS) {
    const mat = []
    for (var i = 0; i < ROWS; i++) {
        const row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}

// random 
function getRandomInt(min, max) {
    var diff = max - min
    var res = Math.floor(Math.random() * diff + min)
    return res
}

// Timers
function updateTimer() {
    const currentTime = new Date().getTime()
    const elapsedTime = (currentTime - gStartTime) / 1000
    document.querySelector('.timer').innerText = elapsedTime.toFixed(3)
}

function startTimer() {
    gStartTime = new Date().getTime()
    gInterval = setInterval(updateTimer, 37)
}

function stopTimer() {
    clearInterval(gInterval)
}
function getElCell(pos) {
    return document.querySelector(`[data-i='${pos.i}'][data-j='${pos.j}']`)
}

document.onkeydown = function (evt) {
    evt = evt || window.event;
    var keyCode = evt.keyCode;
    if ((keyCode >= 37 && keyCode <= 40) || keyCode === 32) {
        return false;
    }
}

function playSound(sound) {
    new Audio(`sound/${sound}.mp3`).play()
}