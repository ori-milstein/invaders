'use strict'

var shootInterval
var gHero = {
    pos: { i: 12, j: 5 },
    isShoot: false,
    laserPos: { i: 11, j: 5 },
    laserFast: false,
    fastCount: 3
}
var laser = '⤊'
var laserSpeed = 80

var gIsLaserFreeze = false

// creates the hero and place it on board 
function createHero() {
    updateCell(gHero.pos, HERO, true)
}

// Handle game keys 
function onKeyDown(ev) {
    if (gGame.isOn === false) {
        console.log('trying to press key but game over')
        console.log('gGame.isOn', gGame.isOn)
        return
    }
    switch (ev.key) {
        case 'ArrowRight':
            moveHero(1)
            break;

        case 'ArrowLeft':
            moveHero(-1)
            break;

        case ' ':
            if (!gHero.isShoot && gGame.isOn) shoot(laserSpeed)
            break;
        case 'n':
            if (gHero.isShoot) {
                blowUpNegs(gHero.laserPos.i + 1, gHero.laserPos.j, gBoard)
            }
            break;
        case 'x':
            fasterLaser()
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
    updateCell(gHero.pos, HERO, true)
}

// Sets an interval for shutting (blinking) the laser up towards aliens 
function shoot(speed, /*laserPosI = gHero.laserPos.i - 1, laserPosJ = gHero.laserPos.j*/) {
    if (gGame.isOn === false) {
        console.log('trying to shoot but cant')
        return
    }
    if (!gHero.laserFast) SHOOTSOUND.play()
    else playSound('FAST')
    gHero.isShoot = true

    gHero.laserPos.i = gHero.pos.i - 1
    gHero.laserPos.j = gHero.pos.j

    shootInterval = setInterval(blinkLaser, speed, gHero.laserPos)
}

// renders a LASER at specific cell for short time and removes it 
function blinkLaser(pos) {
    if (gIsLaserFreeze && shootInterval) return

    const gameObject = (gBoard[pos.i]) ?
        gBoard[pos.i][pos.j].gameObject : null

    const prevPos = { i: pos.i + 1, j: pos.j }
    const prevGameObject = (gBoard[prevPos.i]) ?
        gBoard[prevPos.i][prevPos.j].gameObject : null

    if (pos.i < 0) {
        console.log('out of range')
        // clearInterval(shootInterval)
        // gHero.isShoot = false

        // updateCell(prevPos, null)
        endShoot(prevPos)
        return
    } else if (gameObject === ALIEN ||
        gameObject === 'X') {
        handleAlienHit(pos)
        return
    } else if (gameObject === CANDY) {
        handleCandyHit(pos)
        return
    }
    else if (prevGameObject !== HERO) {
        updateCell(prevPos)
    }

    updateCell(pos, laser)
    gHero.laserPos.i--
}

function endShoot(pos) {
    clearInterval(shootInterval)
    gHero.isShoot = false
    if (gHero.laserFast === true) fasterLaser(false)

    if (gBoard[pos.i][pos.j].gameObject === '^'
        || gBoard[pos.i][pos.j].gameObject === '⤊') {
        updateCell(pos)
    }
}

function blowUpNegs(rowIdx, colIdx, mat) {
    const laserPos = { i: rowIdx, j: colIdx }
    console.log('laserPos', laserPos)
    if (gHero.pos.i === laserPos.i) console.log('hero is laser')

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= mat.length) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue
            if (i === rowIdx && j === colIdx) continue
            const currNegPos = { i, j }

            if (mat[i][j].gameObject === ALIEN) {
                handleAlienHit(currNegPos)
                // updateCell(laserPos)
                endShoot(laserPos)
            }
            else continue
        }
    }
}

function fasterLaser(fast = true, pos = gHero.laserPos) {

    gHero.laserFast = fast

    if (fast && gHero.fastCount > 0) {
        laser = '^'
        laserSpeed = 20
    } else {
        laser = '⤊'
        laserSpeed = 80
        gHero.laserFast = false
        return
    }

    const gameObject = (gBoard[pos.i]) ?
        gBoard[pos.i][pos.j].gameObject : null

    if (gHero.isShoot === true && gameObject !== ALIEN) {
        playSound('FAST')
        clearInterval(shootInterval)

        shootInterval = setInterval(blinkLaser, laserSpeed, pos)

    }
    gHero.fastCount--
    console.log('gHero.fastCount', gHero.fastCount)
}