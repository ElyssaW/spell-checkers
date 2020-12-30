console.log('Hello!')

// Initial variables
let ctx = game.getContext('2d')
// Game Loop Interval
let gameInterval
// Checks if game is on
let gameStart = false

// Set canvas width/height
// Set attribute and get computed style make the game more
// responsive, allowing for clicks and computer graphics to still
// display properly when set
game.setAttribute('width', 1200)
game.setAttribute('height', 700)


// Where the magic happens
let gameLoop = () => {
}

function gameBegin() {
    gameInterval = setInterval(gameLoop, 30)
}

gameBegin()