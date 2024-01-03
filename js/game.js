'use strict'

const BOARD_SIZE = 14
const ALIEN_ROW_LENGTH = 8
const ALIEN_ROW_COUNT = 3
const HERO = '♆'
const ALIEN = '👽'
const LASER = '⤊'
const SKY = 'SKY'
const EARTH = 'EARTH'

// Matrix of cell objects. e.g.: {type: SKY, gameObject: ALIEN} 
var gBoard = []
var gGame = { isOn: false, isStart: false, alienCount: ALIEN_ROW_LENGTH * ALIEN_ROW_COUNT, score: 0, isWin: false, }

// Called when game loads 
function init() {
    createBoard(BOARD_SIZE)
    renderBoard(gBoard)
}

function playGame() {
    if (!gGame.isStart && !gGame.isOn) {
        gIntervalAliens = setInterval(moveAliens, ALIEN_SPEED)
        gGame.isOn = true
        gGame.isStart = true
        renderPanel()
    }
}

function restart() {
    gBoard = []
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = ''

    gGame = { isOn: false, isStart: false, alienCount: ALIEN_ROW_LENGTH * ALIEN_ROW_COUNT, score: 0 }
    firstAlien = /*gBoard.length - ALIEN_ROW_LENGTH*/ 6
    lastAlien = /*gBoard.length - 1*/13
    unHit = false
    gDir = 'left'

    init()
    playGame()
}

// Create and returns the board with aliens on top, ground at bottom // use the functions: createCell, createHero, createAliens 
function createBoard(size) {
    for (var i = 0; i < size; i++) {
        gBoard.push([])
        for (var j = 0; j < size; j++) {
            if (i < ALIEN_ROW_COUNT && j > size - 1 - ALIEN_ROW_LENGTH) {
                gBoard[i].push(createCell(ALIEN))
            } else if (i === size - 1) {
                gBoard[i].push(createCell(null, EARTH))
            } else gBoard[i].push(createCell())
        }
    }
}

// Render the board as a <table> to the page 
function renderBoard(board) {
    const elBoard = document.querySelector('.board')
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]

            var cellClass = (currCell.type === SKY) ? 'sky' : 'earth'

            strHTML += `\t<td class="cell ${cellClass}" data-i="${i}" data-j="${j}">`

            if (currCell.gameObject === ALIEN) {
                strHTML += ALIEN
            }

            strHTML += '</td>\n'
        }
        strHTML += '</tr>\n'
    }
    elBoard.innerHTML = strHTML

    createHero()
}


function renderPanel() {
    document.querySelector('h2').setAttribute('hidden', '')
    document.querySelector('.modal').classList.add('hide')

    document.querySelector('h3').removeAttribute('hidden')
    document.querySelector('h3 span').innerText = '0'
}

function updateScore(diff = 0) {
    gGame.score += diff

    const score = document.querySelector('h3 span')
    score.innerText = `${gGame.score}`
}

// Returns a new cell object. e.g.: {type: SKY, gameObject: ALIEN} 
function createCell(gameObject = null, type = SKY) {
    return { type: type, gameObject: gameObject }
}

// position such as: {i: 2, j: 7} 
function updateCell(pos, gameObject = null) {
    gBoard[pos.i][pos.j].gameObject = gameObject

    var elCell = getElCell(pos)
    elCell.innerHTML = gameObject || ''
}


function checkEndGame(alienCount, bottomRowIdx) {
    if (alienCount === 0) gameOver(true)
    else if (bottomRowIdx === gHero.pos.i) gameOver(false)
}

function gameOver(isWin) {
    clearInterval(gIntervalAliens)
    gGame.isOn = false
    gGame.isWin = isWin

    if (isWin) console.log('Win!')
    else console.log('Lose!')

    renderModal(isWin)
}

function renderModal(isWin) {
    const modalText = (isWin) ? `Victorious!` : `You Lose!`

    document.querySelector('.modal').innerHTML = `${modalText} <button class="button" onclick="restart()">Play Again</button>`

    document.querySelector('.modal').classList.remove('hide')
}