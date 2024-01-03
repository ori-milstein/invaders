'use strict'

var shootInterval
const LASER_SPEED = 80
var gHero = {
    pos: { i: 12, j: 5 }, isShoot: false,
    laserPos: { i: 11, j: 5 },
}

var gIsLaserFreeze = false

// creates the hero and place it on board 
function createHero() {
    updateCell(gHero.pos, HERO)
}

// Handle game keys 
function onKeyDown(ev) {
    if (gGame.isOn === false) return
    switch (ev.key) {
        case 'ArrowRight':
            moveHero(1)
            break;

        case 'ArrowLeft':
            moveHero(-1)
            break;

        case ' ':
            if (!gHero.isShoot) shoot(LASER_SPEED)
            break;
        case 'n':
            if (gHero.isShoot) {
                blowUpNegs(gHero.laserPos.i + 1, gHero.laserPos.j, gBoard)
            }
            break;

        default:
            // null
            break;
    }
}

// Move the hero right (1) or left (-1) 
function moveHero(dir) {
    if ((gHero.pos.j === 0 && dir === -1) ||
        (gHero.pos.j === gBoard.length - 1 && dir === 1)) return

    updateCell(gHero.pos, null)
    gHero.pos.j += dir
    updateCell(gHero.pos, HERO)
}

// Sets an interval for shutting (blinking) the laser up towards aliens 
function shoot(speed) {
    gHero.isShoot = true

    gHero.laserPos.i = gHero.pos.i - 1
    gHero.laserPos.j = gHero.pos.j

    shootInterval = setInterval(blinkLaser, speed, gHero.laserPos)
}

// renders a LASER at specific cell for short time and removes it 
function blinkLaser(pos) {
    if (gIsLaserFreeze && shootInterval) return

    const prevPos = { i: pos.i + 1, j: pos.j }
    const gameObject = (gBoard[pos.i]) ?
        gBoard[pos.i][pos.j].gameObject : null

    if (pos.i < 0) {
        console.log('out of range')
        clearInterval(shootInterval)
        gHero.isShoot = false

        updateCell(prevPos, null)
        return
    } else if (gameObject === ALIEN ||
        gameObject === 'X') {
        handleAlienHit(pos)
        return
    }
    else if (gHero.pos.i !== prevPos.i) {
        updateCell(prevPos, null)
    }

    updateCell(pos, LASER)
    gHero.laserPos.i--
}


function blowUpNegs(rowIdx, colIdx, mat) {
    const laserPos = { i: rowIdx, j: colIdx }
    if (gHero.pos.i === laserPos.i) return

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= mat.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue
            if (i === rowIdx && j === colIdx) continue
            const currNegPos = { i, j }

            if (mat[i][j].gameObject === ALIEN) {
                handleAlienHit(currNegPos)
                updateCell(laserPos)
            }
            else continue
        }
    }
}
