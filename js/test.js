console.log('Hello!')

// Initial variables
let ctx = game.getContext('2d')
// Curent frame of the game
let frame = 0
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
// Initializes array to store player's text input letter by letter
let playerText = []

// Initialize array of objects containing room data
let textArray = [{doorKey: 'Most', doorStart: 'Her Highness\' Royal And ', doorTypo: 'Msot', doorEnd: ' Perfect Essay on The History of Spells'},
                 {doorKey: 'amazing', doorStart: 'And here is the ', doorTypo: 'azginma', doorEnd: ' second sentence'},
                 {doorKey: 'magnificient', doorStart: 'And lastly, the ', doorTypo: 'mnecitnifiag', doorEnd: ' end of the essay!'}
                ]
// Initialize array of enemy names
let spellWords = [ 'das', 'sed', 'wras', 'fas',
                   'qar', 'xas', 'dax', 'wes',
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

//================================================
//
//          Draw Functions
//
//================================================

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
//          Constructor Functions
//
//================================================

// Persistent objects
    let enemy

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
    this.mana = 50
    this.maxmana = 50
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
    this.speed = 1
    this.frameIndex = 0
    this.render = function() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
    this.activate = function() {
        if(detectNear(this, 200)) {
            moveToPlayer(this)
            
            if (detectHit(this)) {
                if (!playerJustHit) {
                    hero.health--
                    playerJustHit = true
                    setTimeout(iframes, 1500)
                }
            }
        } else {
            randomWalk(this)
        }
        
        wallCheck(this)
    }
}

// Constructor function for new enemies
function ExclaimerConstructor(x, y) {
    this.x = x
    this.y = y
    this.color = 'black'
    this.width = 30
    this.height = 30
    this.health = 1
    this.alive = true
    this.xdir = randomRange(15, 30)
    this.ydir = randomRange(15, 30)
    this.speed = 5
    this.frameIndex = 0
    this.render = function() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
    this.activate = function() {
        this.x += this.xdir
        this.y += this.ydir
        
        if (detectHit(this)) {
            this.alive = false
            if (!playerJustHit) {
                this.xdir = this.xdir * -1
                this.ydir = this.ydir * -1
                hero.health--
                playerJustHit = true
                setTimeout(iframes, 1500)
            }
        }
        
        wallCheck(this)
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
function RoomConstructor(index) {
    this.index = index
    this.cleared = false,
    this.contents = []
}

//================================================
//
//          Movement functions
//
//================================================

// Make object walk in random direction
function pickDirection (obj) {
    // Pick random direction value - +x, -x, +y, -y
    let randDir = Math.floor(Math.random() * 5)
    
    // Set object's x/y direction to zero
    obj.xdir = 0
    obj.ydir = 0
    
    // Assign object's current direction based on
    // the random value received above
     switch(randDir) {
        case 1:
            obj.ydir -= obj.speed
            break;
        case 2:
            obj.xdir -= obj.speed
            break
        case 3:
            obj.ydir += obj.speed
            break
        case 4:
            obj.xdir += obj.speed
            break
        default:
        
    }
}

// Function to make object move around canvas. Passes the object to be moved
// and the pattern to move the object in (Random, set, move to player, etc.)
function randomWalk(obj) {
    // Every 30 frames, assign the
    // object a new direction
    if (obj.frameIndex === 30) {
        obj.frameIndex = 0
        pickDirection(obj)
    } else {
        obj.frameIndex++
    }
    
    // Take object's x/y direction
    // Add x/y direction to object's x/y
    obj.x += obj.xdir
    obj.y += obj.ydir
    
    // Check to make sure the object isn't yeeting off the game map
    wallCheck(obj)
}

// Function to move closer to player
function moveToPlayer (obj) {
    
    // Grabs player's x/y and moves toward it. The initial funky if statements
    // help smooth the object's movement out - otherwise it jitters a little
    // trying to get precisely on the same value as the player's x/y
    if (obj.x <= hero.x + 2 && obj.x >= hero.x - 2) {
        obj.x = hero.x
    } else if (obj.x < hero.x) {
        obj.x += obj.speed
    } else {
        obj.x -= obj.speed
    }
    
    if (obj.y <= hero.y + 2 && obj.y >= hero.y - 2) {
        obj.y = hero.y 
    } else if (obj.y > hero.y) {
        obj.y -= obj.speed
    } else {
        obj.y += obj.speed
    }
}

// Detect collision between any given object and the wall
function wallCheck(obj) {
    // Check if player is going over the border
    if (obj.x < 0) {
        obj.x = 0
        obj.xdir = obj.xdir * -1
    } else if (obj.x+obj.width > game.width) {
        obj.x = game.width  - obj.width
        obj.xdir = obj.xdir * -1
    }
    
    if (obj.y < 0) {
        obj.y = 0
        obj.ydir = obj.ydir * -1
    } else if (obj.y+obj.height > game.height) {
        obj.y = game.height  - obj.height
        obj.ydir = obj.ydir * -1
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
    if ((hero.x+hero.width >= obj.x - threshold && hero.x < obj.x+obj.width + threshold) &&
        (hero.y+hero.height >= obj.y - threshold && hero.y < obj.y+obj.height + threshold)) {
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

//================================================
//
//          Input Functions
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

function submissionEvent() {
    
    // Grab player input from box
    playerInput = playerText.join('')
    
    // Reset player text array
    playerText = []
    
    if (compareString(playerInput, compString)) {
        console.log('Correct!')
        correctInput = true
    } else {
        console.log('Wrong!')
        correctInput = false
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

// Listen for letter or submission input from player
document.addEventListener('keypress', e => {
     if (e.charCode >= 97 && e.charCode <= 122) {
        playerText.push(e.key)
    } else if (e.keyCode === 13) {
        submissionEvent()
    } else if (e.keyCode === 8) {
        playerText.pop()
    }
})

// Listen for backspace
document.addEventListener('keydown', e => {
    if (e.keyCode === 8) {
        playerText.pop()
    }
})

let shiftShield = false

// Listen for backspace
document.addEventListener('keydown', e => {
    if (e.keyCode === 16) {
        shiftShield = true
        playerJustHit = true
    }
})

// Listen for backspace
document.addEventListener('keyup', e => {
    if (e.keyCode === 16) {
        shiftShield = false
        playerJustHit = false
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
    
    ctx.fillText(playerText.join(''), hero.x, hero.y - 5)
    
    if (shiftShield && hero.mana > 0) {
        console.log('Shielding')
        ctx.fillStyle = 'rgba(0, 255, 255, 1)'
        ctx.fillRect(hero.x-2, hero.y-2, hero.width+4, hero.height+4)
        hero.mana--
    } else {
        setTimeout(() => {
            while (hero.mana < hero.maxmana) {
                hero.mana++
                console.log('Filling mana')
            }
        }, 2000)
    }
    
    // Move player
    movementHandler()
    
    // Wall check player
    wallCheck(hero)
    
    enemy.render()
    enemy.activate()
    
    // Render hero
    hero.render()
}

function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

function gameBegin() {
    
    enemy = new ExclaimerConstructor(randomRange(50, 1100), 30)
    hero = new HeroConstructor(580, 500, 'hotpink', 60, 60)
    
    gameInterval = setInterval(gameLoop, 30)
    gameStart = true
}

gameBegin()