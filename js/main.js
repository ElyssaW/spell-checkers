console.log('Hello!')

// Initial variables
let ctx = game.getContext('2d')
// Curent frame of the game
let frame = 0
// Current room
let roomIndex = -1
// Current chest
let chestIndex = 0
// Expected String Input
let compString
// Player's submitted input
let playerInput
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
let roomArray = []
// Letter array
let letterArray = ['a', 'b', 'c', 'd', 'e', 'g',
                    'h', 'i', 'j', 'k', 'l', 'm',
                   'n', 'o', 'p', 'q', 'r', 's',
                   't', 'u', 'v', 'w', 'x', 'y', 'z'
                  ]
//// Initialize array of objects containing the word puzzle key/locks
//let textArray = [{doorKey: 'Most', doorStart: 'Welcome to Her Highness\' Royal And ', doorTypo: 'Msot', doorEnd: ' Perfect Essay on The History of Magic'},
//                 {doorKey: 'spells', doorStart: 'Magic is wonderful, and ', doorTypo: 'spllse', doorEnd: ' are wonderful too!'},
//                 {doorKey: 'wonderful', doorStart: 'And you know what else is ', doorTypo: 'ndferwulo', doorEnd: '? Madge!'},
//                 {doorKey: 'kindest', doorStart: 'She is the most wonderful, the ', doorTypo: 'nkidtse', doorEnd: ', most obvlivious person I know.'},
//                 {doorKey: 'confession', doorStart: 'So obvlivious, the only way I could get her to take my ', doorTypo: 'fessconion', doorEnd: ' seriously...'},
//                 {doorKey: 'bury', doorStart: '...was to ', doorTypo: 'yurb', doorEnd: ' it in an essay on magic.'},
//                 {doorKey: 'magnificient', doorStart: 'But more than ', doorTypo: 'yanhingt', doorEnd: ', I would like to tell her...'}
//                ]
// Initialize array of objects containing the word puzzle key/locks
let textArray = [{doorKey: 'Most', doorStart: 'Welcome to Her Highness\' Royal And ', doorTypo: 'Msot', doorEnd: ' Perfect Essay on The History of Magic'},
                 {doorKey: 'grand', doorStart: 'And here is the ', doorTypo: 'grnad', doorEnd: ' next sentence'},
                  {doorKey: 'Okay', doorStart: 'Have I hit word count yet? No? ', doorTypo: 'Kayo', doorEnd: ', here\'s another! Wow!'},
                 {doorKey: 'back', doorStart: 'Okay fine, fine - ', doorTypo: 'bakc', doorEnd: ' to the topic of magic.'},
                  {doorKey: 'speaking', doorStart: 'Magic can be cast by ', doorTypo: 'skeaping', doorEnd: ' magic words aloud.'},
                  {doorKey: 'magic', doorStart: 'But occassionally, the ', doorTypo: 'mgaic', doorEnd: ' words develop a mind of their own'},
                  {doorKey: 'known', doorStart: 'Magic words have been ', doorTypo: 'nownk', doorEnd: ' to roam about and wreak havoc'},
                  {doorKey: 'fight', doorStart: 'But Spellcheckers ', doorTypo: 'fihgt', doorEnd: ' every day to keep them in line.'},
                  {doorKey: 'protect', doorStart: 'Royal Spellcheckers ', doorTypo: 'teproct', doorEnd: ' all royal correspondance from wild magic.'},
                  {doorKey: 'wrestle', doorStart: 'Spellcheckers ', doorTypo: 'sertwle', doorEnd: ' with typos, run-ons, and wild punctuation.'},
                  {doorKey: 'invaluable', doorStart: 'This makes their service ', doorTypo: 'invalauble', doorEnd: ''}
                ]
// Initialize secondary array of non-plot-relevant locks/keys for chests and doors that do not progress forward
//let chestArray = [{doorKey: 'grand', doorStart: 'And here is the ', doorTypo: 'grnad', doorEnd: ' next sentence'},
//                  {doorKey: 'Okay', doorStart: 'Have I hit word count yet? No? ', doorTypo: 'Kayo', doorEnd: ', here\'s another! Wow!'},
//                  {doorKey: 'speaking', doorStart: 'Magic cast by ', doorTypo: 'skeaping', doorEnd: ' magic words aloud.'},
//                  {doorKey: 'magic', doorStart: 'But occassionally, the ', doorTypo: 'mgaic', doorEnd: ' words develop a mind of their own'},
//                  {doorKey: 'known', doorStart: 'Magic words have been ', doorTypo: 'nownk', doorEnd: ' to roam about and wreak havoc'},
//                  {doorKey: 'fight', doorStart: 'But Spellcheckers ', doorTypo: 'fihgt', doorEnd: ' every day to keep them in line.'},
//                  {doorKey: 'protect', doorStart: 'Royal Spellcheckers ', doorTypo: 'teproct', doorEnd: ' all royal correspondance from wild magic.'},
//                  {doorKey: 'wrestle', doorStart: 'Spellcheckers ', doorTypo: 'sertwle', doorEnd: ' with typos, run-ons, and wild punctuation.'},
//                  {doorKey: 'invaluable', doorStart: 'This makes their service ', doorTypo: 'invalauble', doorEnd: ''}
//                ]
// Initialize array of enemy names
let spellWords = ['adverb', 'badger', 'bravest', 'dwarves', 'trace', 'trade', 'cart', 'bare',
                  'craft', 'webcast', 'swagger', 'waste', 'cedar', 'brace', 'fast', 'stave',
                  'carve', 'caster', 'taxes', 'farts', 'strafe', 'grace', 'raw', 'straw',
                  'water', 'craze', 'decaf', 'draft', 'bread', 'barf', 'grave', 'scare',
                  'ersatz', 'great', 'grade', 'farce', 'after', 'extra', 'texas', 'swear'
]

// Set canvas width/height
// Set attribute and get computed style make the game more
// responsive, allowing for clicks and computer graphics to still
// display properly when set
game.setAttribute('width', 1200)
game.setAttribute('height', 700)

//===============================================
//
//              Basic functions
//
//===============================================

// Select random item from given array
function selectRandom (randomArray) {
    return randomArray[Math.floor(Math.random() * randomArray.length)]
}

// Select random number from given range
function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

// Write text above object
function drawText (string, obj) {
    ctx.fillStyle = 'red'
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

// Function to draw text
function drawFillText(string, x, y, color, font, size, align) {
    ctx.font = size+'px '+font
    ctx.fillStyle = color
    ctx.textAlign = align
    ctx.fillText(string, x, y)
}

// Function to draw stroke text
function drawStrokeText(string, x, y, color, font, size, align) {
    ctx.lineWidth = 10
    ctx.font = size+'px '+font
    ctx.strokeStyle = color
    ctx.textAlign = align
    ctx.strokeText(string, x, y)
}

// Write typo text for doors/chests. This functions breaks a sentence
// up into three strings, so that the typo part can be highlighted in red
function drawTypo (obj, string1, string2, string3) {
    // Creates an array of numbers to modify y position with, to simulate floating
    let floatValueArray = [0, 0, -1, -1, -2, -2, -3, -4, -5, -5, -4, -3, -2, -2, -1, -1]
    // Passes the current index value to the modifier variable
    let floatValue = floatValueArray[obj.textFrameIndex]
    
    // Set font/size
    ctx.font = '20px Fredoka One'
    // Get total width of the text, so that the text can be centered above the object generating it
    let textLength = ctx.measureText(string1).width + ctx.measureText(string2).width + ctx.measureText(string3).width
    // Find the center of the total width
    let textCenter = (obj.x+(obj.width/2)) - (textLength/2)
    
    // Draw first half of the sentence
    drawStrokeText(string1, textCenter, obj.y - 3 + floatValue, 'white', 'Fredoka One', 20, 'left')
    drawFillText(string1, textCenter, obj.y - 5 + floatValue, 'grey', 'Fredoka One', 20, 'left')
    
    // Draw typo in the sentence
    drawStrokeText(string2, textCenter + ctx.measureText(string1).width, obj.y - 3 + floatValue, 'white', 'Fredoka One', 20, 'left')
    drawFillText(string2, textCenter + ctx.measureText(string1).width, obj.y - 5 + floatValue, 'red', 'Fredoka One', 20, 'left')
    
    // Draw second half of the sentence
    drawStrokeText(string3, textCenter + ctx.measureText(string1).width + ctx.measureText(string2).width, obj.y - 5 + floatValue, 'white', 'Fredoka One', 20, 'left')
    drawFillText(string3, textCenter + ctx.measureText(string1).width + ctx.measureText(string2).width, obj.y - 5 + floatValue, 'grey', 'Fredoka One', 20, 'left')
    
    // Increment float array index, so as to move the text into the next position when it is drawn
    obj.textFrameIndex++
    // Reset the index if it has reached the end of the array
    if (obj.textFrameIndex ===  floatValueArray.length) {obj.textFrameIndex = 0}
}

// Draw the current word-to-type above the enemy's head
function drawName (obj, string1) {
    let floatValueArray = [0, 0, -1, -1, -2, -2, -3, -4, -5, -5, -4, -3, -2, -2, -1, -1]
    let floatValue = floatValueArray[obj.textFrameIndex]
    
    drawStrokeText(string1, obj.x+(obj.width/2), obj.y - 4 + floatValue, 'white', 'Bungee', 20, 'center')
    drawFillText(string1, obj.x+(obj.width/2), obj.y - 5 + floatValue, 'black', 'Bungee', 20, 'center')
    
    obj.textFrameIndex++
    if (obj.textFrameIndex ===  floatValueArray.length) {obj.textFrameIndex = 0}
}

// Small function to simulate floating on objects directly
function drawFloatAnim(obj) {
    let floatValueArray = [-4, -3, -2, -2, -1, -1, -1, 0, 0, 0, -1, -1, -1, -2, -2, -2, -3, -3, -4]
    let floatValue = floatValueArray[obj.walkFrameIndex]
    if (obj.xdir > 0) {
            ctx.drawImage(obj.sprite, obj.x + obj.hitboxX, obj.y + obj.hitboxY + floatValue)
        } else {
            ctx.drawImage(obj.spriteFlipped, obj.x + obj.hitboxX, obj.y + obj.hitboxY + floatValue)
        }
    obj.walkFrameIndex++
    if (obj.walkFrameIndex ===  floatValueArray.length) {obj.walkFrameIndex = 0}
}

// Function to draw health
function drawHealth() {
    ctx.lineWidth = 1
    // Draw empty health circles
    for (let i = hero.maxhealth; i > 0; i--) {
        ctx.fillStyle = 'white'
        ctx.beginPath()
        ctx.arc(20+(30*i), 50, 30, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
    }
    // Fill health circles
    for (let i = hero.health; i > 0; i--) {
        ctx.fillStyle = hero.color
        ctx.beginPath()
        ctx.arc(20+(30*i), 50, 30, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
    }
}

// Draw sprite without float value
function drawSprite (obj, spriteLeft, spriteRight) {
    if (obj.xdir > 0) {
            ctx.drawImage(spriteRight, obj.x + obj.hitboxX, obj.y + obj.hitboxY)
        } else {
            ctx.drawImage(spriteLeft, obj.x + obj.hitboxX, obj.y + obj.hitboxY)
        }
}

//================================================
//
//          Constructor Functions
//
//================================================

// Constructor function for hero
function HeroConstructor(x, y) {
    this.x = x
    this.y = y
    this.hitboxX = -20
    this.hitboxY = -20
    this.sprite = document.getElementById("madge")
    this.spriteFlipped = document.getElementById("madgeFlipped")
    this.color = 'hotpink'
    this.width = 40
    this.height = 90
    this.health = 3
    this.maxhealth = 3
    this.alive = true
    this.justHit = false
    this.shielded = false
    this.xdir = 0
    this.ydir = 0
    this.wallDirection = 0
    this.textFrameIndex = 0
    this.walkFrameIndex = randomRange(0, 5)
    this.render = function() {
        drawFloatAnim(this)
    }
}

// Constructor function for new enemies
function GhostConstructor(x, y) {
    this.x = x
    this.y = y
    this.hitboxX = 0
    this.hitboxY = 0
    this.faceNum = 1
    this.sprite = document.getElementById('ghostBlank')
    this.spriteFlipped = document.getElementById('ghostBlankFlipped')
    this.spriteFace = document.getElementById('ghost'+randomRange(1,5))
    this.spriteFaceFlipped = document.getElementById('ghost'+randomRange(1,5)+'Flipped')
    this.color = 'grey'
    this.width = 120
    this.height = 120
    this.health = 3
    this.alive = true
    this.xdir = 0
    this.ydir = 0
    this.speed = 2
    this.walkDirection = 0
    this.textFrameIndex = 0
    this.walkFrameIndex = randomRange(0, 5)
    this.spellWords = [selectRandom(spellWords), selectRandom(spellWords), selectRandom(spellWords)]
    this.spellWordIndex = 0
    this.render = function() {
        // Draw sprite body
        drawFloatAnim(this)
        // Draw sprite face
        drawSprite(this, this.spriteFaceFlipped, this.spriteFace)
    }
    // Define enemy behavior
    this.activate = function() {
        // Check if near player
        if(detectNear(this, 400)) {
            // Move to player
            moveToPlayer(this)
            // Draw name to type
            drawName(this, this.spellWords[this.spellWordIndex])
            
            // If player input matches name, decrement health
            if (playerInput == this.spellWords[this.spellWordIndex]) {
                this.health--
                    // If health is depeleted, kill enemy
                    if (this.health === 0) {
                        room.enemyCount--
                        this.alive = false
                    }
                // Move onto the next spell word
                this.spellWordIndex++
            }
            // Decrement player health if hit
            if (detectHit(this)) {
                if (!playerJustHit) {
                    hero.health--
                    playerJustHit = true
                    // Set iframes running
                    setTimeout(iframes, 1500)
                }
            }
        // If the player is not nearby, walk randomly
        } else {
            randomWalk(this)
        }
        // Chck if bumping against the wall
        wallCheck(this)
    }
}

// Constructor function for new enemies
function ExclaimerConstructor(x, y) {
    this.x = x
    this.y = y
    this.hitboxX = 0
    this.hitboxY = 0
    this.sprite = document.getElementById("exclaimer")
    this.color = 'black'
    this.width = 20
    this.height = 20
    this.health = 1
    this.alive = true
    this.xdir = randomRange(20, 30)
    this.ydir = randomRange(20, 30)
    this.speed = 5
    this.walkDirection = 0
    this.textFrameIndex = 0
    this.render = function() {
            // Draw sprite
            ctx.drawImage(this.sprite, this.x, this.y)
        }
    this.activate = function() {
        // Move x/y position
        this.x += this.xdir
        this.y += this.ydir
        
        // Check if the player is hit
        if (detectHit(this)) {
            // Kill enemy if hit
            this.alive = false
            // Decrement health
            if (!playerJustHit) {
                this.xdir = this.xdir * -1
                this.ydir = this.ydir * -1
                hero.health--
                playerJustHit = true
                setTimeout(iframes, 1500)
            }
        }
        // Check if enemy is hitting a wall
        wallCheck(this)
    }
}

// Constructor function for new doors
function DoorConstructor(x, y, leadsTo) {
    this.x = x
    this.y = y
    this.hitboxX = 0
    this.hitboxY = 0
    this.color = 'black'
    this.width = 60
    this.height = 0
    this.firstLock = textArray[roomIndex].doorStart
    this.secondLock = textArray[roomIndex].doorEnd
    this.typo = textArray[roomIndex].doorTypo
    this.key = textArray[roomIndex].doorKey
    this.locked = true
    this.alive = true
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
            if (detectNear(this, 200) && room.enemyCount === 0) {
                // Display typo text
                drawTypo(this, this.firstLock, this.typo, this.secondLock)
                if (this.height < 10) {
                    this.height++
                }
                // Unlock door
                if (playerInput == this.key) {
                    this.locked = false
                }
            } 
        // If door is unlocked, watch for collision
        } else if (detectHit(this)) {
            // Increment room index
            moveToNextRoom()
        } else {
            // Expand door as it's unlocked
            if (this.height < 90) {
                this.height++
            }
        }
    }
}

// Function to move the player to the next room
function moveToNextRoom() {
    // Stop game loop
    clearInterval(gameInterval)
    // Clear canvas
    ctx.clearRect(0, 0, game.width, game.height)
    // Throw a view over the board
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, game.width, game.height)
    // Increment room index
    roomIndex++
    // Reset player input
    playerInput = []
    // Place the player at the bottom of the room
    hero.x = game.width/2
    hero.y = game.height/2 + 200
    // Construct new room and pass it to the current index
    room = new RoomConstructor(roomIndex)
    // Push the newly constructed room to the main room array
    roomArray.push(room)
    // Set gameloop running again
    setTimeout(() => {
        gameInterval = setInterval(gameLoop, 30)
    }, 1000)
}

// Constructor function for new chests
function ChestConstructor(x, y, item) {
    this.x = x
    this.y = y
    this.hitboxX = 0
    this.hitboxY = 0
    this.sprite = document.getElementById('heart')
    this.spriteFlipped = document.getElementById('heart')
    this.color = 'yellow'
    this.width = 60
    this.height = 60
    this.locked = true
    this.alive = true
    this.item = item,
    this.textFrameIndex = 0
    this.walkFrameIndex = 0
    this.render = function() {
        drawFloatAnim(this)
    }
    this.activate = function() {
        // Increment the player's health and erase chest
        if (detectHit(this)) {
            if (hero.health < hero.maxhealth) {
                hero.health++
                this.alive = false
                chestIndex++
            }
        } 
    }
}

// Constructor function for new rooms
function RoomConstructor(index) {
    // Set new room's index to current index
    this.index = index
    // Get enemy count
    this.enemyCount = 0
    // Generate new enemies for the room
    this.contents = generateRoomContent(this)
}

// Function to randomly generate new content for each room
function generateRoomContent(room) {
    // Initialize array to contain enemies
    let array = []
    // Initialize random value
    let random
    // Initialize value to hold the item
    let randomItem
    
    // Each room must contain a door and a chest, so they're generated here
    let door = new DoorConstructor(570, 50, roomIndex)
    let chest = new ChestConstructor(280, 320)
    
    array.push(door)
    array.push(chest)
    
    // Iterate through a loop three times, picking a random option each time to populate into the room
    for (let i = 0; i < 3; i++) {
        // Set random number
        random = Math.floor(Math.random() * 5)
        switch(random) {
            case 1:
                // Add in exclaimer if random num is 1
                randomItem = new ExclaimerConstructor(randomRange(100, game.width-100), randomRange(100, game.height-300))
                break;
            case 2:
                // Add in ghost if random num is 2
                randomItem = new GhostConstructor(randomRange(100, game.width-100), randomRange(100, game.height-300))
                room.enemyCount++
                break;
            case 3:
                // Ad in ghost if random num is 3
                randomItem = new GhostConstructor(randomRange(100, game.width-100), randomRange(100, game.height-300))
                room.enemyCount++
                break;
                // Add in nothing if none are met
            default:
                randomItem = null
                break;
        }
        // Push the generated item to the room contents array if it is not null
        if (randomItem !== null) {
            array.push(randomItem)
        }   
    }
    return array
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
    if (obj.walkDirection === 30) {
        obj.walkDirection = 0
        pickDirection(obj)
    } else {
        obj.walkDirection++
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
        obj.xdir = 1
    } else {
        obj.x -= obj.speed
        obj.xdir = -1
    }
    
    if (obj.y <= hero.y + 2 && obj.y >= hero.y - 2) {
        obj.y = hero.y 
    } else if (obj.y > hero.y) {
        obj.y -= obj.speed
        obj.ydir = -1
    } else {
        obj.y += obj.speed
        obj.ydir = 1
    }
}

// Detect collision between any given object and the wall
function wallCheck(obj) {
    // Check if player is going over the border
    if (obj.x < 50) {
        obj.x = 50
        obj.xdir = obj.xdir * -1
    } else if (obj.x+obj.width > game.width - 50) {
        obj.x = game.width  - obj.width - 50
        obj.xdir = obj.xdir * -1
    }
    
    if (obj.y < 30) {
        obj.y = 30
        obj.ydir = obj.ydir * -1
    } else if (obj.y+obj.height > game.height - 70) {
        obj.y = game.height  - obj.height - 70
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
    playerJustHit = false
}

// Function to play on player death
function killPlayer() {
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
             hero.ydir = 1
         } 
    if (moveObject.up === true) {
             hero.y -= 5
             hero.ydir = -1
         } 
    if (moveObject.right === true) {
             hero.x += 5
             hero.xdir = 1
         } 
    if (moveObject.left === true) {
             hero.x -= 5
             hero.xdir = -1
         } 
}

function submissionEvent() {
    // Grab player input from box
    playerInput = playerText.join('')
    
    // Reset player text array
    playerText = []
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
             hero.ydir = -1
         } 
    if (e.key == 'ArrowDown' || e.key == '2') {
             e.preventDefault()
             moveObject.down = true
             hero.ydir = 1
         } 
    if (e.key == 'ArrowLeft' || e.key == '4') {
             e.preventDefault()
             moveObject.left = true
             hero.xdir = -1
         } 
    if (e.key == 'ArrowRight' || e.key == '6') {
             e.preventDefault()
             moveObject.right = true
             hero.xdir = 1
         }
 })

 document.addEventListener('keyup', e => {
     // Prevent default, so that arrow keys do not interrupt typing or move the cursor
     if (e.key == 'ArrowUp' || e.key == '8') {
             e.preventDefault()
             moveObject.up = false
             hero.ydir = 0
         } 
    if (e.key == 'ArrowDown' || e.key == '2') {
             e.preventDefault()
             moveObject.down = false
             hero.ydir = 0
         } 
    if (e.key == 'ArrowLeft' || e.key == '4') {
             e.preventDefault()
             moveObject.left = false
             hero.xdir = 0
         } 
    if (e.key == 'ArrowRight' || e.key == '6') {
             e.preventDefault()
             moveObject.right = false
             hero.xdir = 0
         }
 })

// Listen for letter or submission input from player
document.addEventListener('keypress', e => {
     if (e.charCode >= 65 && e.charCode <= 122) {
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

// Listen for space bar, to teleport the player 
document.addEventListener('keydown', e => {
    if (e.keyCode === 32) {
        hero.x = hero.x + (hero.xdir * 200)
        hero.y = hero.y + (hero.ydir * 200)
    }
})

//================================================
//
//          Title functions/loop
//
//================================================

// Initialize index
let index = 0
// Initialize frame for circle
let titleFrame = 0
// Initialize circle increase
let titleIncrease = true
// Initialize gradient
let gradient
// Initialize mouseover
let mouseover
// Create animation controller object
let animText = {x: 560,
                y: 360,
                alpha: 0,
                animate: false,
                finished: false}

// Function to listen for a mouseover on the title text
document.addEventListener('mousemove', (e) => {
    if (e.x > 560 && e.x < 870 && e.y > 200 && e.y < 518 && !animText.finished) {
            animText.animate = true
    } else {
            animText.animate = false
        
    }
})

// Start game if clicked
document.addEventListener('click', (e) => {
    if (e.x > 560 && e.x < 870 && e.y > 200 && e.y < 518) {
            moveToNextRoom()
    }
})

// Draw the dashed circle behind the text
function drawCircle() {
    ctx.fillStyle = 'white'
    ctx.strokeStyle = 'black'
    ctx.beginPath()
    ctx.arc(game.width/2, 280, 150, 0, 2 * Math.PI)
    ctx.fill()
    
    ctx.strokeStyle = 'black'
    ctx.beginPath()
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.arc(game.width/2, 280, 150, 0 - frame, 2 * Math.PI + frame)
    ctx.closePath()
    ctx.stroke()
    ctx.setLineDash([])
}

// Draw gradient
function drawGradient() {
    gradient = ctx.createRadialGradient(game.width/2,300,700,562,300,0)
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)")
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, game.width, game.height)
}

function drawTitle() {
    ctx.font = '50px Londrina Solid'
    ctx.textAlign = 'center'
    ctx.fillStyle = 'white'
    ctx.fillText('SPELL CHECKERS', game.width/2, 305+titleFrame)
    ctx.fillStyle = 'black'
    ctx.fillText('SPELL CHECKERS', game.width/2, 300+titleFrame)
    
    // Animate the text bounce
    if (titleFrame > 3) {
        titleIncrease = false
    } else if (titleFrame === 0) {
        titleIncrease = true
    }
    
    if (frame % 8 === 0) {
        if (titleIncrease) {
            titleFrame++
        } else {
            titleFrame--
        }
    }
}

// Draw the strings of letters scrolling up/down in the title screen
function drawBackgroundScroll () {
    ctx.font = '20px serif'
    ctx.fillStyle = 'lightgrey'
    for (let j = 0; j < game.width/10; j++) {
        for (let i = 0; i < letterArray.length; i++) {
            if (index % 2) {
                ctx.fillText(letterArray[i], (30*j), (30*i)+frame)
                ctx.fillText(letterArray[i], (30*j), (30*i)+frame-750)
            } else {
                ctx.fillText(letterArray[i], (30*j), (30*i)-frame)
                ctx.fillText(letterArray[i], (30*j), (30*i)-frame+750)
            }
        }
        index++
    }
    index = 0
}

// Draw the "Start game!" which flies up when the mouse hovers over the title area
function drawStartText() {
    if (!animText.finished && animText.animate) {
            animText.y--
            ctx.font = '30px serif'
            ctx.fillStyle = 'grey'
            ctx.fillText('- Start -', game.width/2, animText.y)
            
            if (animText.y === 350) {
                console.log('Finished')
                animText.finished = true
            }
    }  else if (animText.finished) {
            ctx.font = '30px serif'
            ctx.fillStyle = 'grey'
            ctx.fillText('- Start -', game.width/2, 350) 
    } 
}

function titleLoop () {
    frame++
    //Clear board
    ctx.clearRect(0, 0, game.width, game.height)
    
    drawBackgroundScroll()
    
    drawGradient()
    
    drawCircle()
    
    drawTitle()
    
    drawStartText()
    
    if (frame === 750) {
        frame = 0
    }
}

//================================================
//
//          Game Loop
//
//================================================

// Where the magic happens
let gameLoop = () => {
    
    //Clear board
    ctx.clearRect(0, 0, game.width, game.height)
    
   // Draw background text/gradient
    let index = 0
    drawBackgroundScroll()
    drawGradient()
    
    // Draw room map
    ctx.drawImage(document.getElementById('dungeoncontinue'), 30, 20)
    
    //Check if player is dead
    if (hero.health === 0) {
        killPlayer()
    }
    
    // Increment frame
    frame++
    
    // Reset frame if it reaches 750, to preserve looping on the background scrool
    if (frame === 750) {
        frame = 0
    }
    
    // Draw player's health
    drawHealth()
    
    // Move player
    movementHandler()
    
    // Wall check player
    wallCheck(hero)
    
    // Draw room contents
    for (let i = 0; i < room.contents.length; i++) {
        if (room.contents[i].alive) {
            room.contents[i].render()
            room.contents[i].activate()
        }
    }
    
    // Render hero
    hero.render()
    
    //Write player input text above player
    drawStrokeText(playerText.join(''), hero.x+(hero.width/2), hero.y - 3, 'black', 'Fredoka One', 35, 'center')
    drawFillText(playerText.join(''), hero.x+(hero.width/2), hero.y - 5, 'hotpink', 'Fredoka One', 35, 'center')
}

function gameBegin() {
    ctx.font = '20px Fredoka One'
    
    hero = new HeroConstructor(580, 500, 'hotpink', 60, 60)
    
    gameInterval = setInterval(titleLoop, 30)
    gameStart = true
}

gameBegin()