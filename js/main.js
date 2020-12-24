console.log('Hello!')

// Initial variables
let ctx = game.getContext('2d')
// Curent frame of the game
let frame = 0
// Current room
let roomIndex = 0
// Expected String Input
let compString
// Game Loop Interval
let gameInterval
// Checks if game is on
let gameStart = false
// Checks if player is near a door
let nearDoor = false
// Checks if current room's door is unlocked
let doorUnlocked = false
// Checks if the player was hit recently, so that they can have
// iframes between hits
let playerJustHit = false
// Initialize movement object to allow continuous/diagonal movement
let moveObject = {up: false,
                  down: false,
                  left: false,
                  right: false
                 }

// Track whether an arrow key is pressed. This way, when the player starts typing, and their keypress events
// interrupt the arrow keys' repeating fires, the player will continue to move smoothly
let keyDown = false
let keyValue

// Set canvas width/height
// Set attribute and get computed style make the game more
// responsive, allowing for clicks and computer graphics to still
// display properly when set
game.setAttribute('width', getComputedStyle(game)['width'])
game.setAttribute('height', getComputedStyle(game)['height'])

//===============================================
//
//              Basic functions
//
//===============================================

function selectRandom (randomArray) {
    return randomArray[Math.floor(Math.random() * randomArray.length)]
}

//===============================================
//
//          Typing Functions
//
//===============================================

// Initialize door counter
function renderDoorText(roomIndex) {
    switch(roomIndex) {
        case 0:
            doorOne()
            break;
        case 1:
            doorTwo()
            break;
        case 2:
            doorThree()
            break;
    }
}

// Initialize functions to set the door text
function doorOne () {
    if (nearDoor === false) {
        document.querySelector('#firstHalf').innerText = 'Her Highness\' Royal And '
        document.querySelector('#typo').innerText = 'Msot'
        document.querySelector('#secondHalf').innerText = ' Perfect Essay on The History of Spells'
        nearDoor = true
    } 
}

// Initialize functions to set the door text
function doorTwo () {
    if (nearDoor === false) {
        document.querySelector('#firstHalf').innerText = 'And here is the '
        document.querySelector('#typo').innerText = 'azginma'
        document.querySelector('#secondHalf').innerText = ' second sentence'
        nearDoor = true
    } 
}

// Initialize functions to set the door text
function doorThree () {
    if (nearDoor === false) {
        document.querySelector('#firstHalf').innerText = 'And finally, the '
        document.querySelector('#typo').innerText = 'mnecitnifiag'
        document.querySelector('#secondHalf').innerText = ' second sentence'
        nearDoor = true
    } 
}

function clearText () {
    document.querySelector('#firstHalf').innerText = ''
    document.querySelector('#typo').innerText = ''
    document.querySelector('#secondHalf').innerText = ''
    nearDoor = false
}

// If input matches expected string, unlock door
function compareString(input, compString) {
    if (input == compString) {
        doorUnlocked = true
        door.color = 'white'
    } else {
    // If string input is not correct, deduct health
        console.log('Booooo')
        hero.health--
        console.log(hero.health)
    }
}

// Add event listener for form submission
document.querySelector('form').addEventListener('submit', (e)=> {
    
    // Prevent dafult refresh
    e.preventDefault()
    
    // Grab player input from box
    let playerInput = textInput.value
    
    // Reset text input box to empty
    textInput.value = ''
    
    if (nearDoor) {
        compareString(playerInput, compString)
    }
})

//================================================
//
//          Constructor Functions
//
//================================================

// Initialize persistent objects
let door
let doorMat
let doorMatEdge
let enemy
let hero

// Constructor function for new objects
function Constructor(x, y, color, width, height) {
    this.x = x
    this.y = y
    this.color = color
    this.width = width
    this.height = height
    this.health = 3
    this.alive = true
    this.xdir = 0
    this.ydir = 0
    this.frameIndex = 0
    this.render = function() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

// Generates new door + door adjacent objects
function generateDoor () { 
    door = new Constructor(850, 40, 'red', 60, 60)
    doorMat = new Constructor(door.x-((door.width)/2), door.y-((door.height)/2), 'blue', 120, 120)
    doorMatEdge = new Constructor(door.x-((door.width)/2)-15, door.y-((door.height)/2)-15, 'green', 150, 150)
}

// Generates new player. Should only run on game start
function generatePlayer () {
    hero = new Constructor(150, 150, 'hotpink', 60, 60)
}

//================================================
//
//               Enemy functions
//
//================================================

// Initialize array of enemy names
let enemyNames = [ 'das', 'sed', 'wras', 'fas',
                   'qar', 'xas', 'dax', 'wes',
]

// Function to generate an enemy
function generateEnemy () {
    enemy = new Constructor(600, 300, 'grey', 40, 80)
    
    enemy.names = [selectRandom(enemyNames), 
                   selectRandom(enemyNames),
                   selectRandom(enemyNames)]

    enemy.nameIndex = 0
    console.log(enemy.names[1])
}

//================================================
//
//          Placement/Draw Functions
//
//================================================

// Function to check which room the player should progress to next, and
// run all associated functions for it
function moveToNextRoom (roomIndex) {
    switch(roomIndex) {
        case 0:
            doorOne()
            break;
        case 1:
            drawSecondRoom()
            doorTwoe()
            break;
        case 2:
            drawThirdRoom()
            doorThree()
            break;
        case 3:
            console.log('You won!')
    }
}

// Create second room
function drawSecondRoom () {
    // Place new locked door
    placeDoorLocked(400, 400)
    compString = 'amazing'
    doorUnlocked = false
    door.color = 'red'
    
    // Place player
    hero.x = 40
    hero.y = 40
}

// Create third and final room
function drawThirdRoom () {
    // Place new locked door
    placeDoorLocked(600, 200)
    compString = 'magnificient'
    doorUnlocked = false
    door.color = 'red'
    
    // Place player
    hero.x = 40
    hero.y = 40
}

function placeDoorLocked (x, y) { 
    // Move door, doormat, and doormat edge to
    // proper place
    door.x = x
    door.y = y
    doorMat.x = door.x-(door.width/2)
    doorMat.y = door.y-(door.height/2)
    doorMatEdge.x = door.x-(door.width/2)-15
    doorMatEdge.y = door.y-(door.height/2)-15
    
    // Set door to locked
    door.alive = true
}

//================================================
//
//          Movement functions
//
//================================================

// Make object walk in random direction
function randomWalk (obj) {
    // Pick random direction value - +x, -x, +y, -y
    let randDir = Math.floor(Math.random() * 5)
    
    // Set object's x/y direction to zero
    obj.xdir = 0
    obj.ydir = 0
    
    // Assign object's current direction based on
    // the random value received above
     switch(randDir) {
        case 1:
            obj.ydir -= 2
            break;
        case 2:
            obj.xdir -= 2
            break
        case 3:
            obj.ydir += 2
            break
        case 4:
            obj.xdir += 2
            break
        default:
        
    }
}

// Function to make object move around canvas. Passes the object to be moved
// and the pattern to move the object in (Random, set, move to player, etc.)
function objectWalk(obj) {
    // Every 30 frames, assign the
    // object a new direction
    if (obj.frameIndex === 30) {
        obj.frameIndex = 0
        randomWalk(obj)
    } else {
        obj.frameIndex++
    }
    
    // Take object's x/y direction
    // Add x/y direction to object's x/y
    obj.x += obj.xdir
    obj.y += obj.ydir
}

// Function to move closer to player
function moveToPlayer (obj) {
    
    // Grabs player's x/y and moves toward it. The initial funky if statements
    // help smooth the object's movement out - otherwise it jitters a little
    // trying to get precisely on the same value as the player's x/y
    if (obj.x <= hero.x + 2 && obj.x >= hero.x - 2) {
        obj.x = hero.x
    } else if (obj.x < hero.x) {
        obj.x += 1
    } else {
        obj.x -= 1
    }
    
    if (obj.y <= hero.y + 2 && obj.y >= hero.y - 2) {
        obj.y = hero.y 
    } else if (obj.y > hero.y) {
        obj.y -= 1
    } else {
        obj.y += 1
    }
}

// Detect collision between any given object and the wall
function wallCheck(obj) {
    // Check if player is going over the border
    if (obj.x < 0) {
        obj.x = 0
        obj.xdir = 10
    } else if (obj.x+obj.width > game.width) {
        obj.x = game.width  - obj.width
        obj.xdir = -10
    }
    
    if (obj.y < 0) {
        obj.y = 0
        obj.ydir = 10
    } else if (obj.y+obj.height > game.height) {
        obj.y = game.height  - obj.height
        obj.ydir = -10
    }
}

// Four corner collision detection
let detectHit = (obj) => {
        // Check top left corner
    if (((hero.x >= obj.x && hero.x < obj.x+obj.width) &&
        (hero.y >= obj.y && hero.y < obj.y+obj.height)) ||
        
        // Check top right corner
        ((hero.x+hero.width >= obj.x && hero.x < obj.x) &&
        (hero.y >= obj.y && hero.y < obj.y+obj.height)) ||
        
        // Check bottom right corner
        ((hero.x <= obj.x && hero.x+hero.width > obj.x) &&
        (hero.y+hero.height >= obj.y && hero.y < obj.y)) ||
        
        // Check bottom left corner
        ((hero.x >= obj.x && hero.x < obj.x+obj.width) &&
        (hero.y <= obj.y && hero.y+hero.height > obj.y))) {
            console.log('Hit detected')
            return true
        } else {
            return false
        }
}

//================================================
//
//          Player Functions
//
//================================================

// Function to create iframes on the player, so that they
// are not instantly killed on one hit from an enemy
function iframes () {
    console.log('iframes up')
    playerJustHit = false
}

// Function to play on player death
function killPlayer() {
    console.log('u ded')
    clearInterval(gameInterval)
}

// Checks which direction the player is trying to move in, and moves them there
function movementHandler () {
    
    if (moveObject.down === true) {
             hero.y += 5
         } 
    if (moveObject.up === true) {
             hero.y -= 5
         } 
    if (moveObject.right === true) {
             hero.x += 5
         } 
    if (moveObject.left === true) {
             hero.x -= 5
         } 
}

// This duo of functions essentially replicates the keypress events for the arrow keys.
// The typical keypress event gets interrupted by typing - meaning, the hero will stop
// moving when the player types, until the player moves them again. This tracks the arrowkeys
// by keydown/keyup instead, so that the computer will continue accepting movement input even
// while the keyboard is being used for typing. Storing the values in an object allow for
// diagonal movement.
document.addEventListener('keydown', e => {
     // Prevent default, so that arrow keys do not interrupt typing or move the cursor
     if (e.key == 'ArrowUp') {
             e.preventDefault()
             moveObject.up = true
         } 
    if (e.key == 'ArrowDown') {
             e.preventDefault()
             moveObject.down = true
         } 
    if (e.key == 'ArrowLeft') {
             e.preventDefault()
             moveObject.left = true
         } 
    if (e.key == 'ArrowRight') {
             e.preventDefault()
             moveObject.right = true
         } 
 })

 document.addEventListener('keyup', e => {
     // Prevent default, so that arrow keys do not interrupt typing or move the cursor
     if (e.key == 'ArrowUp') {
             e.preventDefault()
             moveObject.up = false
         } 
    if (e.key == 'ArrowDown') {
             e.preventDefault()
             moveObject.down = false
         } 
    if (e.key == 'ArrowLeft') {
             e.preventDefault()
             moveObject.left = false
         } 
    if (e.key == 'ArrowRight') {
             e.preventDefault()
             moveObject.right = false
         } 
 })

//================================================
//
//          Game Loop
//
//================================================

// Where the magic happens
let gameLoop = () => {
    
    //Clear board
    ctx.clearRect(0, 0, game.width, game.height)
    
    // Increment frame
    frame++
    
    // Move player
    movementHandler(keyValue)
    
    // Check if player's health is at 0
    if (hero.health === 0) {
        killPlayer()
    }
    
    // Check if player is near a door
    if (detectHit(doorMat)) {
        renderDoorText(roomIndex)
    } else if (detectHit(doorMatEdge)) {
        clearText()
    }
    
    // Check if player is trying and able to move through door
    if (detectHit(door) && doorUnlocked) {
        console.log('Move to next room')
        door.alive = true
        clearText()
        roomIndex++
        moveToNextRoom(roomIndex)
    } else if (detectHit(door)) {
        
    }
    
    // Move the enemy to the player
    moveToPlayer(enemy)
    
    // Look to see if the enemy has hit the player
    if (detectHit(enemy)) {
        if (!playerJustHit) {
            hero.health--
            playerJustHit = true
            setTimeout(iframes, 1500)
        }
    }
    
    // Check if player is going over the border
    if (hero.x < 0) {
        hero.x = 0
    } else if (hero.x+hero.width > game.width) {
        hero.x = game.width  - hero.width
    }
    
    if (hero.y < 0) {
        hero.y = 0
    } else if (hero.y+hero.height > game.height) {
        hero.y = game.height  - hero.height
    }

    // Render hero
    doorMatEdge.render()
    doorMat.render()
    door.render()
    
    enemy.render()
    hero.render()
}

function gameBegin() {
    generateDoor()
    generateEnemy()
    generatePlayer()
    gameInterval = setInterval(gameLoop, 30)
    compString = 'Most'
    gameStart = true
    
    
}

gameBegin()