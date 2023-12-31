'use strict'

const LASER_SPEED = 80
var gHero = { pos: { i: 12, j: 5 }, isShoot: false, laserPos: { i: 11, j: 5 }, }
var shootInterval

// creates the hero and place it on board 
function createHero(board) {
    // board[gHero.pos.i][gHero.pos.j].gameObject = HERO

    updateCell(gHero.pos, HERO)
}

// Handle game keys 
function onKeyDown(ev) {
    switch (event.key) {
        case 'ArrowRight':
            moveHero(1)
            break;

        case 'ArrowLeft':
            moveHero(-1)
            break;

        case 's':
            if (!gHero.isShoot) shoot(500)
            break;

        default:
            // null
            break;
    }
}

// Move the hero right (1) or left (-1) 
function moveHero(dir) {
    if ((gHero.pos.j === 0 && dir === -1) || (gHero.pos.j === gBoard.length - 1 && dir === 1)) return
    updateCell(gHero.pos, null)
    gHero.pos.j += dir
    updateCell(gHero.pos, HERO)

}

// Sets an interval for shutting (blinking) the laser up towards aliens 
function shoot(speed) {
    gHero.isShoot = true

    gHero.laserPos.i = gHero.pos.i
    gHero.laserPos.j = gHero.pos.j
    shootInterval = setInterval(blinkLaser, speed, gHero.laserPos)
    // blinkLaser(gHero.laserPos)

}

// renders a LASER at specific cell for short time and removes it 
function blinkLaser(pos) {
    var prevPos = { i: pos.i + 1, j: pos.j }
    console.log('pos', pos)

    if (pos.i < 0) {
        console.log('first if')
        clearInterval(shootInterval)
        gHero.isShoot = false

        updateCell(prevPos, null)
        return
    } else if (gBoard[pos.i][pos.j].gameObject === HERO) {
        console.log('hero')
        gHero.laserPos.i--
        return
    } else if (gBoard[pos.i][pos.j].gameObject === ALIEN) {
        handleAlienHit(pos)
        gHero.isShoot = false
        return
    } else if (prevPos.i !== gHero.pos.i) {
        updateCell(prevPos, null)
    }

    updateCell(pos, LASER)
    gHero.laserPos.i--
}

