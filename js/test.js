console.log('Hello!')

// Initial variables
let ctx = game.getContext('2d')
// Curent frame of the game
let frame = 0
// Current room
let roomIndex = 0
// Expected String Input
let compString
// Player's submitted input
let playerInput
// Variable to contain if input was correct
let correctInput
// Game Loop Interval
let gameInterval
// Checks if game is on
let gameStart = false
// Checks if the player was hit recently, so that they can have
// iframes between hits
let playerJustHit = false
// Initialize movement object to allow continuous/diagonal movement
let moveObject = {up: false,
                  down: false,
                  left: false,
                  right: false
                 }
// Initialize array of objects containing room data
let roomArray = []

// Initialize array of objects containing room data
let textArray = [{doorKey: 'Most', doorStart: 'Her Highness\' Royal And ', doorTypo: 'Msot', doorEnd: ' Perfect Essay on The History of Spells'},
                 {doorKey: 'amazing', doorStart: 'And here is the ', doorTypo: 'azginma', doorEnd: ' second sentence'},
                 {doorKey: 'magnificient', doorStart: 'And lastly, the ', doorTypo: 'mnecitnifiag', doorEnd: ' end of the essay!'}
                ]

// Set canvas width/height
// Set attribute and get computed style make the game more
// responsive, allowing for clicks and computer graphics to still
// display properly when set
game.setAttribute('width', 1200)
game.setAttribute('height', 600)

//===============================================
//
//              Basic functions
//
//===============================================

function selectRandom (randomArray) {
    return randomArray[Math.floor(Math.random() * randomArray.length)]
}

// Function to write text above object
function drawText (string, obj) {
    ctx.fillStyle = 'red'
    ctx.font = '20px sans-serif'
    ctx.fillText(string, obj.x, obj.y-5)
}

// If input matches expected string, unlock door
function compareString(input, compString) {
    if (input === compString) {
        return true
    } else {
    // If string input is not correct, deduct health
        return false
    }
}

function submissionEvent(e) {
    // Prevent dafult refresh
    e.preventDefault()
    
    // Grab player input from box
    playerInput = textInput.value
    
    // Reset text input box to empty
    textInput.value = ''
    
    if (compareString(playerInput, compString)) {
        console.log('Correct!')
        correctInput = true
    } else {
        console.log('Wrong!')
        correctInput = false
    }
}

document.addEventListener('submit', submissionEvent)

//================================================
//
//          Constructor Functions
//
//================================================

// Constructor function for hero
function Constructor(x, y, color, width, height) {
    this.x = x
    this.y = y
    this.color = color
    this.width = width
    this.height = height
    this.alive = true
    this.xdir = 0
    this.ydir = 0
    this.frameIndex = 0
    this.textFrameIndex = 0
    this.render = function() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

// Constructor function for hero
function HeroConstructor(x, y) {
    this.x = x
    this.y = y
    this.color = 'hotpink'
    this.width = 50
    this.height = 50
    this.health = 3
    this.maxhealth = 3
    this.alive = true
    this.justHit = false
    this.xdir = 0
    this.ydir = 0
    this.frameIndex = 0
    this.textFrameIndex = 0
    this.render = function() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

// Constructor function for new enemies
function GhostConstructor(x, y) {
    this.x = x
    this.y = y
    this.color = 'grey'
    this.width = 40
    this.height = 80
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

// Constructor function for new doors
function DoorConstructor(x, y, leadsTo) {
    this.x = x
    this.y = y
    this.color = 'red'
    this.width = 60
    this.height = 60
    this.firstLock = 'Test test ',
    this.secondLock = 'test test',
    this.typo = 'stet ',
    this.key = 'test'
    this.locked = true
    this.leadsTo = leadsTo,
    this.textFrameIndex = 0
    this.render = function() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
    this.activate = function() {
        // Check if door is locked
        if (this.locked) {
            //If door is locked, check if player is near
            if (detectNear(this, 200)) {
                // Set expected string to key text
                compString = this.key
                // And display typo text
                drawTypo(door, this.firstLock, this.typo, this.secondLock)
                
                if (correctInput) {
                    console.log('Door unlocked')
                    this.locked = false
                    correctInput = false
                }
            }
        // If door is unlocked, watch for collision
        } else if (detectHit(this)) {
            // And take player to next room
            console.log('Moving to next room')
        } 
    }
}

// Constructor function for new rooms
function RoomConstructor() {
    this.cleared = false,
    this.contains = []
}

// Generates new door + door adjacent objects
function generateDoor () { 
    door = new DoorConstructor(580, -20, 1)
}

// Generates new player. Should only run on game start
function generatePlayer () {
    hero = new Constructor(580, 500, 'hotpink', 60, 60)
}

//================================================
//
//          Movement functions
//
//================================================

// Detect collision between any given object and the wall
function wallCheck(obj) {
    // Check if player is going over the border
    if (obj.x < 0) {
        obj.x = 0
    } else if (obj.x+obj.width > game.width) {
        obj.x = game.width  - obj.width
    }
    
    if (obj.y < 0) {
        obj.y = 0
    } else if (obj.y+obj.height > game.height) {
        obj.y = game.height  - obj.height
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
            return true
        } else {
            return false
        }
}

// Detects nearness
let detectNear = (obj, threshold) => {
        // Check top left corner
    if ((hero.x >= obj.x - threshold && hero.x < obj.x+obj.width + threshold) &&
        (hero.y >= obj.y - threshold && hero.y < obj.y+obj.height + threshold)) {
            return true
        } else {
            return false
        }
}

// Write typo text for doors/chests. This functions breaks a sentence
// up into three strings, so that the typo part can be highlighted in red
function drawTypo (obj, string1, string2, string3) {
    let floatValueArray = [0, 0, -1, -1, -2, -2, -3, -4, -5, -5, -4, -3, -2, -2, -1, -1]
    let floatValue = floatValueArray[obj.textFrameIndex]
    
    getCenter = (ctx.measureText(string1).width + ctx.measureText(string2).width + ctx.measureText(string3).width)/2.5
    textX = obj.x - getCenter
    
    ctx.fillStyle = 'black'
    ctx.font = '20px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText(string1, textX, obj.y - 5 + floatValue)
    ctx.fillStyle = 'red'
    ctx.fillText(string2, textX + ctx.measureText(string1).width, obj.y - 5 + floatValue)
    ctx.fillStyle = 'black'
    ctx.fillText(string3, textX + ctx.measureText(string1).width + ctx.measureText(string2).width, obj.y - 5 + floatValue)
    
    obj.textFrameIndex++
    if (obj.textFrameIndex ===  floatValueArray.length) {obj.textFrameIndex = 0}
}

//================================================
//
//          Player Functions
//
//================================================

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
// while the keyboard is being used for typing. 
document.addEventListener('keydown', e => {
     // Prevent default, so that arrow keys do not interrupt typing or move the cursor
     if (e.key == 'ArrowUp' || e.key == '8') {
             e.preventDefault()
             moveObject.up = true
         } 
    if (e.key == 'ArrowDown' || e.key == '2') {
             e.preventDefault()
             moveObject.down = true
         } 
    if (e.key == 'ArrowLeft' || e.key == '4') {
             e.preventDefault()
             moveObject.left = true
         } 
    if (e.key == 'ArrowRight' || e.key == '6') {
             e.preventDefault()
             moveObject.right = true
         }
 })

 document.addEventListener('keyup', e => {
     // Prevent default, so that arrow keys do not interrupt typing or move the cursor
     if (e.key == 'ArrowUp' || e.key == '8') {
             e.preventDefault()
             moveObject.up = false
         } 
    if (e.key == 'ArrowDown' || e.key == '2') {
             e.preventDefault()
             moveObject.down = false
         } 
    if (e.key == 'ArrowLeft' || e.key == '4') {
             e.preventDefault()
             moveObject.left = false
         } 
    if (e.key == 'ArrowRight' || e.key == '6') {
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
    movementHandler()
    
    // Wall check player
    wallCheck(hero)

    // Render door
    door.render()
    door.activate()
    
    // Render hero
    hero.render()
}

function gameBegin() {
    generateDoor()
    generatePlayer()
    
    gameInterval = setInterval(gameLoop, 30)
    gameStart = true
}

gameBegin()