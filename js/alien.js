'use strict'

const ALIEN_SPEED = 500
var gIntervalAliens
var firstAlien = /*gBoard.length - ALIEN_ROW_LENGTH*/ 6
var lastAlien = /*gBoard.length - 1*/13

var gDir = 'left'
// The following two variables represent the part of the matrix (some rows) // that we should shift (left, right, and bottom) // We need to update those when: // (1) shifting down and (2) last alien was cleared from row 
var gAliensTopRowIdx = 0
var gAliensBottomRowIdx = ALIEN_ROW_COUNT - 1

var gIsAlienFreeze = false


function createAliens(board) {
    // if (i === gHero.pos.i && j === gHero.pos.j) {
    //     strHTML += ALIEN
    // updateCell(board[i], HERO)

}

function handleAlienHit(pos) {
    gHero.isShoot = false
    const prevPos = { i: pos.i + 1, j: pos.j }

    // console.log(`alien at ${pos.i}, ${pos.j}`)

    // updateCell(pos, 'X')
    gBoard[pos.i][pos.j].isExploded = true

    updateCell(pos)
    if (/*gBoard[prevPos.i][prevPos.j] !== HERO &&*/ gBoard[prevPos.i][prevPos.j].gameObject === LASER) {
        updateCell(prevPos)
    }
    clearInterval(shootInterval)
    gGame.alienCount--
    console.log(`ggame.aliencount ${gGame.alienCount}`)
    gGame.score += 10
    console.log('score', gGame.score)
    checkEndGame(gGame.alienCount, gAliensBottomRowIdx)


    updateRowsCols(pos)
}

function updateRowsCols(pos) {
    var isAlien
    if (pos.i === gAliensTopRowIdx && pos.j === firstAlien) {
        firstAlien++
        // console.log('firstAlien', firstAlien)
    } else if (pos.i === gAliensTopRowIdx && pos.j === lastAlien) {
        lastAlien--
        // console.log('lastAlien', lastAlien)
    }

    for (var j = firstAlien; j <= lastAlien; j++) {
        if (gBoard[gAliensBottomRowIdx][j].gameObject === ALIEN) { isAlien = true } else { isAlien = false }
    }
    if (!isAlien) gAliensBottomRowIdx--

}

function shiftBoardRight(board, fromI, toI) {
    for (var i = gAliensTopRowIdx; i <= gAliensBottomRowIdx; i++) {
        for (var j = toI; j >= fromI; j--) {
            // console.log(i)
            // console.log(j)
            // if (j - 1 < 0) {
            //     return
            // }
            // board[i][j - 1].gameObj = board[i][j].gameObj
            var pos = { i: i, j: j }
            var nextPos = { i: i, j: j + 1 }
            // console.log(nextPos)
            // if (j > fromI) {
            // updateCell(nextPos, board[i][j].gameObject)
            // updateCell(pos, null)
            // }
            // else {
            //     var leftPos = { i: i, j: fromI }
            //     var isAlein = (gBoard[leftPos.i][leftPos.j].gameObject === ALIEN)

            //     if (isAlein) updateCell(leftPos)
            // }

            if (gBoard[pos.i][pos.j].gameObject === ALIEN) {
                if (gBoard[nextPos.i][nextPos.j].gameObject === LASER) {
                    handleAlienHit(nextPos)
                    continue
                }
                updateCell(nextPos, board[i][j].gameObject)
                updateCell(pos, null)
            }

            // // console.log(pos)
            // // console.log(board[i][j])
            // updateCell(leftPos, null)
        }
    }

    firstAlien++
    lastAlien++
}
function shiftBoardLeft(board, fromI, toI) {
    for (var i = gAliensTopRowIdx; i <= gAliensBottomRowIdx; i++) {
        for (var j = fromI; j <= toI; j++) {
            // console.log(i)
            // console.log(j)
            // if (j - 1 < 0) {
            //     return
            // }
            // board[i][j - 1].gameObj = board[i][j].gameObj
            var pos = { i: i, j: j }
            var nextPos = { i: i, j: j - 1 }


            if (gBoard[pos.i][pos.j].gameObject === ALIEN) {
                if (gBoard[nextPos.i][nextPos.j].gameObject === LASER) {
                    handleAlienHit(nextPos)
                    continue
                }
                updateCell(nextPos, board[i][j].gameObject)
                updateCell(pos, null)
            } /*else {
                updateCell(nextPos)*/



            // console.log(pos)
            // console.log(board[i][j])

        }
    }
    firstAlien--
    lastAlien--
}

function shiftBoardDown(board, fromI, toI) {
    for (var i = gAliensBottomRowIdx; i >= gAliensTopRowIdx; i--) {
        for (var j = fromI; j <= toI; j++) {
            var pos = { i: i, j: j }
            var nextPos = { i: i + 1, j: j }

            // updateCell(nextPos, board[i][j].gameObject)
            // /*if (i !== -1)*/ updateCell(pos, null)


            // console.log(pos)
            // console.log(board[i][j])
            if (gBoard[pos.i][pos.j].gameObject === ALIEN) {
                // if (gBoard[nextPos.i][nextPos.j].gameObject === LASER) {
                //     handleAlienHit(nextPos)
                // }
                updateCell(nextPos, board[i][j].gameObject)
                updateCell(pos, null)
            }

        }
    }
    gAliensTopRowIdx++
    gAliensBottomRowIdx++
    checkEndGame(gGame.alienCount, gAliensBottomRowIdx)
}

// runs the interval for moving aliens side to side and down // it re-renders the board every time // when the aliens are reaching the hero row - interval stops 
function moveAliens(dir = gDir) {
    if (gIsAlienFreeze) return
    if (gGame.ison === false) return
    // var firstAlien = /*gBoard.length - ALIEN_ROW_LENGTH*/ 6
    // var lastAlien = /*gBoard.length - 1*/13
    // for (var i = firstAlien; i < lastAlien; firstAlien--) {
    //     if (firstAlien === 1) {
    //         clearInterval(gIntervalAliens)
    //         return
    //     }

    //     lastAlien--
    // }
    if (gGame.isStart === true) { }

    // if (lastAlien === gBoard[0].length - 1) {
    //     clearInterval(gIntervalAliens)



    //     console.log('firstAlien', firstAlien)
    //     console.log('lastAlien', lastAlien)
    //     setTimeout(shiftBoardRight, 2000, gBoard, firstAlien, lastAlien)
    // }

    // }


    // firstAlien--
    // lastAlien--
    if (firstAlien === 0 && dir === 'left' || dir === 'right' && lastAlien === gBoard[0].length - 1) {
        // clearInterval(gIntervalAliens)
        shiftBoardDown(gBoard, firstAlien, lastAlien)

        if (dir === 'left') gDir = 'right'
        else if (dir === 'right') gDir = 'left'
        // console.log('firstAlien', firstAlien)
        // console.log('lastAlien', lastAlien)
        // setTimeout(shiftBoardRight, 2000, gBoard, firstAlien, lastAlien)
        // gIntervalAliens = setInterval(moveAliens, ALIEN_SPEED, dir)
    } else if (dir === 'left') { shiftBoardLeft(gBoard, firstAlien, lastAlien) } else if (dir === 'right') { shiftBoardRight(gBoard, firstAlien, lastAlien) }


}






