'use strict'

const BOARD_SIZE = 14
const ALIEN_ROW_LENGTH = 8
const ALIEN_ROW_COUNT = 3
const HERO = 'HERO'
const ALIEN = 'ALIEN'
const SKY = 'SKY'
const EARTH = 'EARTH'
const CANDY = 'CANDY'

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
const SHOOTSOUND = new Audio(`sound/SHOOT.mp3`)
SHOOTSOUND.preload = 'auto'
SHOOTSOUND.volume = 0.5

var gIntervalCandy
var gTimeoutCandy
var gTimeoutFreeze

// Matrix of cell objects. e.g.: {type: SKY, gameObject: ALIEN} 
var gBoard = []
var gGame = {
    isOn: false,
    isStart: false,
    alienCount: ALIEN_ROW_LENGTH * ALIEN_ROW_COUNT,
    score: 0,
    isWin: false,
    isDirLeft: true,
}

// Called when game loads 
function init() {
    createBoard(BOARD_SIZE)
    renderBoard(gBoard)
}

function playGame() {
    // playSound('SHOOT', 0.001)

    // SHOOTSOUND.play()
    // SHOOTSOUND.volume = 0.5
    if (!gGame.isStart && !gGame.isOn) {
        gIntervalAliens = setInterval(moveAliens, ALIEN_SPEED)
        gIntervalCandy = setInterval(addCandy, 10000)
        gGame.isOn = true
        gGame.isStart = true
        renderPanel()
    }
}

function restart() {
    gBoard = []
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = ''

    gGame = {
        isOn: false,
        isStart: false,
        alienCount: ALIEN_ROW_LENGTH * ALIEN_ROW_COUNT,
        score: 0,
        isWin: false,
        isDirLeft: true,
    }
    gHero = {
        pos: { i: 12, j: 5 },
        isShoot: false,
        laserPos: { i: 11, j: 5 },
        laserFast: false,
        fastCount: 3
    }

    gAliensLeftColIdx = BOARD_SIZE - ALIEN_ROW_LENGTH
    gAliensRightColIdx = BOARD_SIZE - 1

    gIsAlienFreeze = false

    clearTimeout(gTimeoutCandy)
    clearTimeout(gTimeoutFreeze)
    clearInterval(gIntervalAliens)
    clearInterval(gIntervalCandy)

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
                strHTML += `<img src="img/ALIEN.png">`
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
    return { type: type, gameObject: gameObject, img: false }
}

// position such as: {i: 2, j: 7} 
function updateCell(pos, gameObject = null, img = false) {

    gBoard[pos.i][pos.j].gameObject = gameObject

    var elCell = getElCell(pos)
    elCell.innerHTML = /*gameObject*/ getObjHtml(gameObject, img) || ''
}

function getObjHtml(object, img) {
    if (img) {
        return `<img src="img/${object}.png">`
    } else return object
}

function checkEndGame(alienCount, bottomRowIdx) {
    if (alienCount === 0) gameOver(true)
    else if (bottomRowIdx === gHero.pos.i /* -1 && lastAlien === 13*/) gameOver(false)
}

function gameOver(isWin) {
    gGame.isOn = false
    console.log('gGame.isOn', gGame.isOn)
    clearInterval(gIntervalAliens)
    clearInterval(gIntervalCandy)
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


function addCandy() {
    const cellPos = getRandomEmptyCellPosition(1, gBoard.length)

    updateCell(cellPos, CANDY, true)
    gTimeoutCandy = setTimeout((pos) => {
        const cell = gBoard[pos.i][pos.j]
        if (cell.gameObject === CANDY) updateCell(pos)
    }, 5000, cellPos)
}

function handleCandyHit(pos) {
    playSound('CANDY')
    const prevPos = { i: pos.i + 1, j: pos.j }

    console.log(`CANDY HIT! at ${pos.i}, ${pos.j}`)

    updateCell(pos)

    endShoot(prevPos)

    updateScore(50)
    console.log('score', gGame.score)

    gIsAlienFreeze = true
    gTimeoutFreeze = setTimeout(() => { gIsAlienFreeze = false }, 5000)
}