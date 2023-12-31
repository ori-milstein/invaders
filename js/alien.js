'use strict'

const ALIEN_SPEED = 500
var gIntervalAliens

// The following two variables represent the part of the matrix (some rows) // that we should shift (left, right, and bottom) // We need to update those when: // (1) shifting down and (2) last alien was cleared from row 
var gAliensTopRowIdx
var gAliensBottomRowIdx

var gIsAlienFreeze = true
if (gIsAlienFreeze) clearInterval(gIntervalAliens)

function createAliens(board) {
    // if (i === gHero.pos.i && j === gHero.pos.j) {
    //     strHTML += ALIEN
    // updateCell(board[i], HERO)

}

function handleAlienHit(pos) {
    const prevPos = { i: pos.i + 1, j: pos.j }

    console.log('alien!')
    updateCell(pos, 'X')
    gBoard[pos.i][pos.j].isExploded = true

    updateCell(pos)
    clearInterval(shootInterval)
    updateCell(prevPos)
    gGame.alienCount++
    gGame.score += 10
}

function shiftBoardRight(board, fromI, toI) {
    for (var i = 0; i < ALIEN_ROW_COUNT; i++) {
        for (var j = toI; j >= fromI - 1; j--) {
            // console.log(i)
            // console.log(j)
            // if (j - 1 < 0) {
            //     return
            // }
            // board[i][j - 1].gameObj = board[i][j].gameObj

            var nextPos = { i: i, j: j + 1 }
            console.log(nextPos)
            updateCell(nextPos, board[i][j].gameObject)

            // var leftPos = { i: i, j: fromI }
            // // console.log(pos)
            // // console.log(board[i][j])
            // updateCell(leftPos, null)
        }
    }
}
function shiftBoardLeft(board, fromI, toI) {
    for (var i = 0; i < ALIEN_ROW_COUNT; i++) {
        for (var j = fromI; j <= toI; j++) {
            // console.log(i)
            // console.log(j)
            // if (j - 1 < 0) {
            //     return
            // }
            // board[i][j - 1].gameObj = board[i][j].gameObj

            var nextPos = { i: i, j: j - 1 }

            updateCell(nextPos, board[i][j].gameObject)

            var pos = { i: i, j: j }
            // console.log(pos)
            // console.log(board[i][j])
            updateCell(pos, null)
        }
    }
}

function shiftBoardDown(board, fromI, toI) {
    for (var i = toI; i > fromI - 1; i--) {
        for (var j = 0; j < board.length; j++) {
            var nextPos = { i: i + 1, j: j }

            updateCell(nextPos, board[i][j].gameObject)

            var pos = { i: i, j: j }
                // console.log(pos)
                // console.log(board[i][j])
                /*if (i !== -1)*/ updateCell(pos, null)
        }
    }
}

// runs the interval for moving aliens side to side and down // it re-renders the board every time // when the aliens are reaching the hero row - interval stops 
function moveAliens() { }