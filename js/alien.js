'use strict'

const ALIEN_SPEED = 500
var gIntervalAliens
var firstAlien = /*gBoard.length - ALIEN_ROW_LENGTH*/ 6
var lastAlien = /*gBoard.length - 1*/13
var unHit = false
var gDir = 'left'

// The following two variables represent the part of the matrix (some rows) // that we should shift (left, right, and bottom) // We need to update those when: // (1) shifting down and (2) last alien was cleared from row 
var gAliensTopRowIdx = 0
var gAliensBottomRowIdx = ALIEN_ROW_COUNT - 1

var gIsAlienFreeze = false

// function createAliens(cellPos) {
//     updateCell(cellPos, ALIEN, true)
// }

function handleAlienHit(pos) {
    playSound('SHOT')
    const prevPos = { i: pos.i + 1, j: pos.j }

    console.log(`HIT! at ${pos.i}, ${pos.j}`)

    updateCell(pos)

    endShoot(prevPos)
    gGame.alienCount--
    console.log(`ggame.aliencount ${gGame.alienCount}`)
    updateScore(10)
    console.log('score', gGame.score)
    updateRowsCols()
    checkEndGame(gGame.alienCount, gAliensBottomRowIdx)
}

function updateRowsCols() {

    var leftColIdx = gBoard[0].length - 1
    var rightColIdx = 0
    var botRowIdx = 0
    var topRowIdx = gBoard.length - 1

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].gameObject === ALIEN) {
                if (j < leftColIdx) { leftColIdx = j }
                if (j > rightColIdx) { rightColIdx = j }

                if (i < topRowIdx) { topRowIdx = i }
                if (i > botRowIdx) { botRowIdx = i }
            }
        }
    }
    firstAlien = leftColIdx
    lastAlien = rightColIdx
    gAliensTopRowIdx = topRowIdx
    gAliensBottomRowIdx = botRowIdx

    console.log('firstAlien', firstAlien)
    console.log('lastAlien', lastAlien)
    console.log('gAliensTopRowIdx', gAliensTopRowIdx)
    console.log('gAliensBottomRowIdx', gAliensBottomRowIdx)
}


function shiftBoardRight(board, fromI, toI) {
    for (var i = gAliensTopRowIdx; i <= gAliensBottomRowIdx; i++) {
        for (var j = toI; j >= fromI; j--) {
            var pos = { i: i, j: j }
            var nextPos = { i: i, j: j + 1 }

            if (board[pos.i][pos.j].gameObject === ALIEN) {
                updateCell(pos, null)

                if (board[nextPos.i][nextPos.j].gameObject === laser) {
                    handleAlienHit(nextPos)
                    continue
                }

                updateCell(nextPos, ALIEN, true)
            }
        }
    }
    updateRowsCols()
}

function shiftBoardLeft(board, fromI, toI) {
    for (var i = gAliensTopRowIdx; i <= gAliensBottomRowIdx; i++) {
        for (var j = fromI; j <= toI; j++) {
            var pos = { i: i, j: j }
            var nextPos = { i: i, j: j - 1 }


            if (board[pos.i][pos.j].gameObject === ALIEN) {
                updateCell(pos, null)

                if (board[nextPos.i][nextPos.j].gameObject === laser) {
                    handleAlienHit(nextPos)
                    continue
                }

                updateCell(nextPos, ALIEN, true)
            }
        }
    }
    updateRowsCols()
}

function shiftBoardDown(board, fromI, toI) {
    for (var i = gAliensBottomRowIdx; i >= gAliensTopRowIdx; i--) {
        for (var j = fromI; j <= toI; j++) {
            var pos = { i: i, j: j }
            var nextPos = { i: i + 1, j: j }

            if (board[pos.i][pos.j].gameObject === ALIEN) {
                updateCell(pos, null)

                if (board[nextPos.i][nextPos.j].gameObject === laser) {
                    handleAlienHit(nextPos)
                    continue
                }

                updateCell(nextPos, ALIEN, true)
            }
        }
    }
    updateRowsCols()
    checkEndGame(gGame.alienCount, gAliensBottomRowIdx)
}

// runs the interval for moving aliens side to side and down // it re-renders the board every time // when the aliens are reaching the hero row - interval stops 
function moveAliens(dir = gDir) {
    if (gIsAlienFreeze || gGame.ison === false) return

    if (firstAlien === 0 && dir === 'left' || dir === 'right' && lastAlien === gBoard[0].length - 1) {
        shiftBoardDown(gBoard, firstAlien, lastAlien)

        if (dir === 'left') gDir = 'right'
        else if (dir === 'right') gDir = 'left'
    }
    else if (dir === 'left') { shiftBoardLeft(gBoard, firstAlien, lastAlien) } else if (dir === 'right') { shiftBoardRight(gBoard, firstAlien, lastAlien) }
}






