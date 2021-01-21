let playgroundDivs = [];
let possiblePacManPosition = [];

const widthBlocks = 28;
const lengthBlock = widthBlocks;

const breakPointRight = 391;
const breakPointLeft = 364;

let pinkyStartPosition = 376;
let inkyStartPosition = 351;
let blinkyStartPosition = 348;
let clydeStartPosition = 379;

let pinkySpeed = 400;
let inkySpeed = 300;
let blinkySpeed = 250;
let clydeSpeed = 500;

let rudl = 'R';

////////////////////////////////////////////////////////////////////
/// import levels layout from pattern.js
////////////////////////////////////////////////////////////////////

import { level } from './pattern.js'
let layoutLevel = level[0]

let playground = document.querySelector('.playground')
let score = document.getElementById('score')
let scoreValue = 0;

let startBtn = document.getElementById('start')
let pauseBtn = document.getElementById('pause')

////////////////////////////////////////////////////////////////////
/// create playground dives
////////////////////////////////////////////////////////////////////

function createDiv (level) {
    for (let i = 0; i < (widthBlocks * lengthBlock); i++){
        playgroundDivs[i] = document.createElement('div')
        //playgroundDivs[i].classList.add('playground_blocks')
        playground.appendChild(playgroundDivs[i])
    }
}

////////////////////////////////////////////////////////////////////
/// create playground levels pattern
////////////////////////////////////////////////////////////////////

function levelCreator (level, arr){
    for (let i = 0; i < level.length; i++){
        
        if (level[i] === 0 ) playgroundDivs[i].classList.add('pac_dot');
        if (level[i] === 1 ) playgroundDivs[i].classList.add('wall');
        if (level[i] === 2 || level[i] === 5) playgroundDivs[i].classList.add('ghost_lair');
        if (level[i] === 3 ) {
            playgroundDivs[i].classList.add('power_pellet');
            playgroundDivs[i].innerHTML = '<img src="./images/ice.png" alt="ice">'
        }
        if (level[i] === 4 ) arr.push(i);   /// made array that possible place for pacman 
        if (level[i] === 5 ) playgroundDivs[i].classList.add('ghost_lair_gate');
        if (level[i] === 9 ) playgroundDivs[i].classList.add('wall', 'unaccessable');
    }
}

////////////////////////////////////////////////////////////////////
/// choose pacman position randomly 
////////////////////////////////////////////////////////////////////

function choosePacManPosition () {
    let maxRnd = possiblePacManPosition.length
    let rndIndex = Math.floor( Math.random() * maxRnd )
    let pacman = possiblePacManPosition[rndIndex]
    
    playgroundDivs[pacman].innerHTML = `<img src="./images/pacman${rudl}.png" alt="pac-man">`
    return pacman;
    playgroundDivs[pacman].classList.add('pacman')
}

////////////////////////////////////////////////////////////////////
/// Movment control 
////////////////////////////////////////////////////////////////////

function movmentControl (e) {
    
    playgroundDivs[currentPacManPosition].innerHTML = ''
    playgroundDivs[currentPacManPosition].classList.remove('pacman')
    
    checkWinGame ()
    
    switch (e.keyCode) {
        /// left key
        case 37:
            if (currentPacManPosition === breakPointLeft) {
                    currentPacManPosition = breakPointRight
                    rudl = 'L';
                    break;
            }
            if (
                checkWallGhost(currentPacManPosition - 1) &&
                currentPacManPosition % widthBlocks !== 0
                ) currentPacManPosition -= 1;
                
            rudl = 'L';
            break;
        /// up key
        case 38:
            if (
                checkWallGhost(currentPacManPosition - widthBlocks) &&
                currentPacManPosition - widthBlocks >= 0 
                ) currentPacManPosition -= widthBlocks;
            rudl = 'U';
            break;
        /// right key
        case 39:
            if (currentPacManPosition === breakPointRight) {
                    currentPacManPosition = breakPointLeft
                    rudl = 'R';
                    break;
            }
            if (
                checkWallGhost(currentPacManPosition + 1) &&
                currentPacManPosition % widthBlocks < widthBlocks - 1
                ) currentPacManPosition += 1;
                
            rudl = 'R';
            break;
        /// down key
        case 40:
            if (
                checkWallGhost(currentPacManPosition + widthBlocks) &&
                currentPacManPosition + widthBlocks < widthBlocks * widthBlocks
                ) currentPacManPosition += widthBlocks;
            rudl = 'D';
            break;
    }

    eatPacDot()
    eatPowerPellet()

    playgroundDivs[currentPacManPosition].classList.add('pacman')
    playgroundDivs[currentPacManPosition].innerHTML = `<img src="./images/pacman${rudl}.png" alt="pac-man">`;
      
}

////////////////////////////////////////////////////////////////////
/// check wall & ghost lair 
////////////////////////////////////////////////////////////////////

function checkWallGhost (position) {
    if (
        !playgroundDivs[position].classList.contains('ghost_lair') &&
        !playgroundDivs[position].classList.contains('wall')
        ) return true;
    return false;
}

////////////////////////////////////////////////////////////////////
/// remove pacDot and update score
////////////////////////////////////////////////////////////////////

function eatPacDot () {
    if (playgroundDivs[currentPacManPosition].classList.contains('pac_dot')) {
        playgroundDivs[currentPacManPosition].classList.remove('pac_dot');
        scoreValue++;
        score.textContent = scoreValue;
    }
}

////////////////////////////////////////////////////////////////////
/// power pellet eaten function
////////////////////////////////////////////////////////////////////

function eatPowerPellet () {
    if (playgroundDivs[currentPacManPosition].classList.contains('power_pellet')) {
        playgroundDivs[currentPacManPosition].classList.remove('power_pellet')
        playgroundDivs[currentPacManPosition].innerHTML = ''
        
        scoreValue += 10;
        score.textContent = scoreValue;
        
        ghosts.forEach(ghost => ghost.isScared = true )
        
        setTimeout(unScaredGhost, 10000)
    }
}

////////////////////////////////////////////////////////////////////
/// unScare ghostes after timeout
////////////////////////////////////////////////////////////////////

function unScaredGhost () {
    ghosts.forEach(ghost => ghost.isScared = false )
}



////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
//// call functions to start drawing
////////////////////////////////////////////////////////////////////


createDiv()
levelCreator(layoutLevel, possiblePacManPosition)
let currentPacManPosition = choosePacManPosition()



////////////////////////////////////////////////////////////////////
/// ghosts class and position
////////////////////////////////////////////////////////////////////

class Ghost {
    constructor(ghostName, ghostStartPosition, ghostSpeed) {
        this.ghostName = ghostName
        this.ghostStartPosition = ghostStartPosition
        this.ghostSpeed = ghostSpeed
        this.ghostCurrentPosition = ghostStartPosition
        this.isScared = false
        this.timerId = NaN
        this.pacDot = false
    }
}

const ghosts = [
    new Ghost('blinky', blinkyStartPosition, blinkySpeed),
    new Ghost('pinky', pinkyStartPosition, pinkySpeed),
    new Ghost('inky', inkyStartPosition, inkySpeed),
    new Ghost('clyde', clydeStartPosition, clydeSpeed)
];

ghosts.forEach(ghost => {
    playgroundDivs[ghost.ghostCurrentPosition].innerHTML = `<img src="./images/${ghost.ghostName}.png" alt="${ghost.ghostName}">`
    playgroundDivs[ghost.ghostCurrentPosition].classList.add('ghost')
});

////////////////////////////////////////////////////////////////////
/// moving the ghosts
////////////////////////////////////////////////////////////////////

function movingGhost (ghost) {
    let movingPossible = [1, -1, widthBlocks, -widthBlocks]
    let direction = movingPossible[Math.floor(Math.random() * movingPossible.length)]
    
    ghost.timerId = setInterval(function() {
        ////// check the walls and other ghost for moving ghost
        if (
            !playgroundDivs[ghost.ghostCurrentPosition + direction].classList.contains('wall') &&
            !playgroundDivs[ghost.ghostCurrentPosition + direction].classList.contains('ghost') 
            ) {
                playgroundDivs[ghost.ghostCurrentPosition].innerHTML = ''
                playgroundDivs[ghost.ghostCurrentPosition].classList.remove('ghost')
                ////// check pacdat
                if (ghost.pacDot) {
                    playgroundDivs[ghost.ghostCurrentPosition].classList.add('pac_dot');
                    ghost.pacDot = false;
                }
                if (playgroundDivs[ghost.ghostCurrentPosition].classList.contains('power_pellet')){
                    playgroundDivs[ghost.ghostCurrentPosition].innerHTML = '<img src="./images/ice.png" alt="ice">'
                }
                
                ghost.ghostCurrentPosition += direction
                
                if (
                    playgroundDivs[ghost.ghostCurrentPosition].classList.contains('pac_dot')
                ) {
                    playgroundDivs[ghost.ghostCurrentPosition].classList.remove('pac_dot');
                    ghost.pacDot = true;
                }
                playgroundDivs[ghost.ghostCurrentPosition].classList.add('ghost')
                playgroundDivs[ghost.ghostCurrentPosition].innerHTML = `<img src="./images/${ghost.ghostName}.png" alt="${ghost.ghostName}">`;
        } else direction = movingPossible[Math.floor(Math.random() * movingPossible.length)]
        
        if (ghost.isScared) playgroundDivs[ghost.ghostCurrentPosition].innerHTML = `<img src="./images/scared.png" alt="scared">`
        
        ////  check the scarde ghost to eat
        if (playgroundDivs[ghost.ghostCurrentPosition].classList.contains('pacman')  
             &&
            ghost.isScared
            ) {
                scoreValue += 100;
                score.textContent = scoreValue;
                
                ghost.pacDot = false;
                playgroundDivs[ghost.ghostCurrentPosition].classList.remove('ghost')
                playgroundDivs[ghost.ghostCurrentPosition].innerHTML = ''
                ghost.ghostCurrentPosition = ghost.ghostStartPosition
                playgroundDivs[ghost.ghostCurrentPosition].classList.add('ghost')
                playgroundDivs[ghost.ghostCurrentPosition].innerHTML = `<img src="./images/${ghost.ghostName}.png" alt="${ghost.ghostName}">`
                
                playgroundDivs[currentPacManPosition].innerHTML = `<img src="./images/pacman${rudl}.png" alt="pac-man">`;                
        }
        
        checkGameOver ()
        
    }, ghost.ghostSpeed)
}

////////////////////////////////////////////////////////////////////
/// Check Game WON or OVER 
///////////////////////////////////////////////////////////////////

function checkGameOver () {
    if (
        playgroundDivs[currentPacManPosition].classList.contains('ghost') &&
        !ghosts[0].isScared
        ){
            ghosts.forEach(ghost => clearInterval(ghost.timerId));
            document.removeEventListener('keydown', movmentControl)
            
            score.style.color = '#ff0000'
            overLayer('loser', '😈 You are a LOSER 😈')  
        }
}

function checkWinGame () {
    if (scoreValue >= 270) {
        
        ghosts.forEach(ghost => clearInterval(ghost.timerId));
        document.removeEventListener('keydown', movmentControl)
            
        overLayer('winner', '🥳 WooW You Win 🥳') 
    }
}

////////////////////////////////////////////////////////////////////
/// over Layer Message
///////////////////////////////////////////////////////////////////

function overLayer (style, message) {
    const overlay = document.createElement('div')
  
    overlay.style.display = 'flex';
    overlay.style.height = '100vh';
    overlay.style.position = 'fixed';
    overlay.style.top = '0'
    overlay.style.bottom = '0'
    overlay.style.left = '0'
    overlay.style.right = '0'
    overlay.style.backgroundColor = 'rgba(0, 0, 0, .8)'
    
    overlay.innerHTML = `
        <section class='overlay ${style}'>
            <h1>${message}</h1>
        </section>
    `
    
    overlay.addEventListener('click', event => {
        //if (event.currentTarget !== event.target) return
        document.location.reload()
    })
    
    document.body.appendChild(overlay)
}

////////////////////////////////////////////////////////////////////
/// start & pause Button function
//////////////////////////////////////////////////////////////////

function startButton () {
    startBtn.style.display = 'none';
    pauseBtn.style.display = 'block';
    
    document.addEventListener('keydown', movmentControl)
    ghosts.forEach(ghost => movingGhost(ghost))
}

function pauseButton () {
    pauseBtn.style.display = 'none';
    startBtn.style.display = 'block';
    
    ghosts.forEach(ghost => clearInterval(ghost.timerId));
    document.removeEventListener('keydown', movmentControl)
}



startBtn.addEventListener('click', startButton)
pauseBtn.addEventListener('click', pauseButton)
