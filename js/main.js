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
// Initialize array of objects containing the word puzzle key/locks
let textArray = [ {doorKey: 'typo', doorStart: 'Welcome to Spell Checker training! Move around with the numpad. Correct this ', doorTypo: 'tpyo', doorEnd: ' to open the door.'},
                  {doorKey: 'space', doorStart: 'Need some space? Move and tap the ', doorTypo: 'scpae', doorEnd: ' bar to dash.'},
                  {doorKey: 'typing', doorStart: 'Tame the wild quotation spirit by', doorTypo: 'tpying', doorEnd: ' their names'},
                  {doorKey: 'begin', doorStart: 'Well done! Now we can ', doorTypo: 'beign', doorEnd: ' in earnest'},
                  {doorKey: 'back', doorStart: 'Okay fine, fine - ', doorTypo: 'bakc', doorEnd: ' to the topic of magic.'},
                  {doorKey: 'speaking', doorStart: 'Magic can be cast by ', doorTypo: 'skeaping', doorEnd: ' magic words aloud.'},
                  {doorKey: 'magic', doorStart: 'But occassionally, the ', doorTypo: 'mgaic', doorEnd: ' words develop a mind of their own'},
                  {doorKey: 'known', doorStart: 'Magic words have been ', doorTypo: 'nownk', doorEnd: ' to roam about and wreak havoc'},
                  {doorKey: 'fight', doorStart: 'But Spellcheckers ', doorTypo: 'fihgt', doorEnd: ' every day to keep them in line.'},
                  {doorKey: 'protect', doorStart: 'Royal Spellcheckers ', doorTypo: 'teproct', doorEnd: ' all royal correspondance from wild magic.'},
                  {doorKey: 'wrestle', doorStart: 'Spellcheckers ', doorTypo: 'sertwle', doorEnd: ' with typos, run-ons, and wild punctuation.'},
                  {doorKey: 'invaluable', doorStart: 'This makes their service ', doorTypo: 'invalauble', doorEnd: ''}
                ]
// Initialize array of enemy names
let spellWords = []

let spellWordsRight = ['adverb', 'badger', 'bravest', 'dwarves', 'trace', 'trade', 'cart', 'bare',
                  'craft', 'webcast', 'swagger', 'waste', 'cedar', 'brace', 'fast', 'stave',
                  'carve', 'caster', 'taxes', 'farts', 'sad', 'strafe', 'grace', 'raw', 'straw',
                  'water', 'craze', 'decaf', 'draft', 'bread', 'barf', 'grave', 'scare',
                  'ersatz', 'great', 'grade', 'farce', 'after', 'extra', 'texas', 'swear', 'ace',
                  'vex', 'dab', 'west', 'feta', 'fear', 'date', 'cafe', 'brat', 'zebra', 'waxer',
                  'tzars', 'drat', 'face'
]

let spellWordsLeft = ['only', 'big', 'bug', 'king', 'junk', 'numb', 'punk', 'milk',
                  'limp', 'jump', 'lingo', 'bingo', 'gumbo', 'ghoul', 'himbo', 'pylon',
                  'hokum', 'limbo', 'plumb', 'vinyl', 'goblin', 'unholy', 'joking', 'joy', 'poking',
                  'boil', 'puking', 'kingly', 'hulk', 'bump', 'buoy', 'moghul', 'gluon',
                  'glyph', 'bunko', 'young', 'hunk', 'gulp', 'bijou', 'blimp', 'glib'
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
    ctx.lineWidth = 1
}

// Generic function to draw a circle
function circle(x, y, radius, fill, stroke, start, end, dash) {
    if (typeof start === 'undefined') {
        start = 0
    }
    if (typeof end === 'undefined') {
        end = 2 * Math.PI
    }
    ctx.fillStyle = fill
    ctx.strokeStyle = stroke
    if (typeof dash !== 'undefined') {
        ctx.setLineDash(dash)
    }
    ctx.beginPath()
    ctx.arc(x, y, radius, start, end)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    ctx.setLineDash([])
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
    drawFillText(string2, textCenter + ctx.measureText(string1).width, obj.y - 5 + floatValue, 'hotpink', 'Fredoka One', 20, 'left')
    
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
    drawStrokeText(string1, obj.x+(obj.width/2), obj.y - 12, 'white', 'Bungee', 20, 'center')
    drawFillText(string1, obj.x+(obj.width/2), obj.y - 14, 'black', 'Bungee', 20, 'center')
}

// Small function to simulate floating on objects directly
function drawFloatAnim(obj) {
    ctx.drawImage(obj.sprite, obj.x + obj.hitboxX, obj.y + obj.hitboxY + getFloatPos(obj))
}

function getFloatPos(obj) {
    let floatValue = obj.floatArray[obj.floatIndex] 
    obj.floatIndex++
    if (obj.floatIndex === obj.floatArray.length) {
        obj.floatIndex = 0
    }
    return floatValue
}

// Function to draw health
function drawHealth() {
    ctx.lineWidth = 1
    // Draw empty health circles
    for (let i = hero.maxhealth; i > 0; i--) {
        circle(20+(30*i), 50, 30, 'white', 'black', 0, 2 * Math.PI, [5, 5])
    }
    // Fill health circles
    for (let i = hero.health; i > 0; i--) {
        circle(20+(30*i), 50, 30, 'hotpink', 'black', 0 - frame, 2 * Math.PI + frame, [5, 5])
    }
}

// Draw sprite without float value
function drawSprite (obj, sprite) {
    ctx.drawImage(sprite, obj.x + obj.hitboxX, obj.y + obj.hitboxY)
}

// This one's for ghosts only
function spriteCheck(obj) {
    if (obj.xdir < 0) {
        obj.face = obj.faceLeft
        obj.sprite = obj.spriteLeft
    } else if (obj.xdir > 0) {
        obj.face = obj.faceRight
        obj.sprite = obj.spriteRight
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
    this.floatArray = [-4, -3, -2, -2, -1, -1, -1, 0, 0, 0, -1, -1, -1, -2, -2, -2, -3, -3, -4]
    this.floatIndex = 0
    this.hitboxX = -20
    this.hitboxY = -20
    this.sprite = document.getElementById("madge")
    this.color = 'hotpink'
    this.width = 40
    this.height = 90
    this.health = 3
    this.maxhealth = 3
    this.alive = true
    this.justHit = false
    this.xdir = 0
    this.ydir = 0
    this.wallDirection = 0
    this.textFrameIndex = 0
    this.dashArray = []
    this.render = function() {
        drawFloatAnim(this)
    }
}

// Constructor function for new enemies
function GhostConstructor(x, y) {
    this.x = x
    this.y = y
    this.floatArray = [-4, -3, -2, -2, -1, -1, -1, 0, 0, 0, -1, -1, -1, -2, -2, -2, -3, -3, -4]
    this.floatIndex = 0
    this.hitboxX = 0
    this.hitboxY = 0
    this.faceNum = randomRange(2, 5)
    this.sprite = document.getElementById('ghostBlank')
    this.face = document.getElementById('ghost'+this.faceNum)
    this.spriteRight = document.getElementById('ghostBlank')
    this.faceRight = document.getElementById('ghost'+this.faceNum)
    this.spriteLeft = document.getElementById('ghostBlankFlipped')
    this.faceLeft = document.getElementById('ghost'+this.faceNum+'Flipped')
    this.color = 'grey'
    this.width = 120
    this.height = 120
    this.health = 3
    this.alive = true
    this.xdir = 0
    this.ydir = 0
    this.speed = randomRange(1, 3)
    this.walkDirection = 0
    this.textFrameIndex = 0
    this.spellWords = [selectRandom(spellWords), selectRandom(spellWords), selectRandom(spellWords)]
    this.spellWordIndex = 0
    this.render = function() {
        // Check for direction on ghost
        spriteCheck(this)
        // Draw sprite body
        drawFloatAnim(this)
        // Draw sprite face
        drawSprite(this, this.face)
    }
    // Define enemy behavior
    this.activate = function() {
        // Check if near player
        if(detectNear(this, 400)) {
            // Move to player
            moveToObject(this, hero)
            // Draw name to type
            drawName(this, this.spellWords[this.spellWordIndex])
            
            // If player input matches name, decrement health
            if (playerInput == this.spellWords[this.spellWordIndex]) {
                damageEnemy(this, 'white', 'lightgrey')
                    // If health is depeleted, kill enemy
                    if (this.health === 0) {
                        killEnemy(this, 'white', 'lightgrey')
                        this.alive = false
                    }
                // Move onto the next spell word
                this.spellWordIndex++
            }
            // Decrement player health if hit
            if (detectHit(this)) {
                if (!hero.justHit) {
                    
                    damangePlayer(this)
                    
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

function PeriodConstructor(x, y) {
    this.x = x
    this.y = y
    this.floatArray = [-4, -3, -2, -2, -1, -1, -1, 0, 0, 0, -1, -1, -1, -2, -2, -2, -3, -3, -4]
    this.floatIndex = 0
    this.hitboxX = 0
    this.hitboxY = 0
    this.faceNum = randomRange(2, 5)
    this.sprite = document.getElementById('periodBlank')
    this.face = document.getElementById('period')
    this.spriteRight = document.getElementById('periodBlank')
    this.faceRight = document.getElementById('period')
    this.spriteLeft = document.getElementById('periodBlankFlipped')
    this.faceLeft = document.getElementById('periodFlipped')
    this.color = 'grey'
    this.width = 120
    this.height = 120
    this.health = 3
    this.alive = true
    this.xdir = 0
    this.ydir = 0
    this.speed = randomRange(1, 3)
    this.walkDirection = 0
    this.bulletTimer = 0
    this.textFrameIndex = 0
    this.spellWords = [selectRandom(spellWords), selectRandom(spellWords), selectRandom(spellWords)]
    this.spellWordIndex = 0
    this.render = function() {
        // Check for direction on ghost
        spriteCheck(this)
        // Draw sprite body
        drawFloatAnim(this)
        // Draw sprite face
        drawSprite(this, this.face)
    }
    this.activate = function() {
            // Move to player
            moveToObject(this, hero)
            // Increase bullet timer
            this.bulletTimer++
            // Every 60 frames, release bullets
            if (this.bulletTimer === 60) {
                room.contents.push(new bulletConstructor(this.x + this.width/2, this.y + this.height/2, 1, 1))
                room.contents.push(new bulletConstructor(this.x + this.width/2, this.y + this.height/2, -1, 1))
                room.contents.push(new bulletConstructor(this.x + this.width/2, this.y + this.height/2, 1, -1))
                room.contents.push(new bulletConstructor(this.x + this.width/2, this.y + this.height/2, -1, -1))
            }
        
            if (this.bulletTimer === 120) {
                room.contents.push(new bulletConstructor(this.x + this.width/2, this.y + this.height/2, 0, 1))
                room.contents.push(new bulletConstructor(this.x + this.width/2, this.y + this.height/2, 0, -1))
                room.contents.push(new bulletConstructor(this.x + this.width/2, this.y + this.height/2, 1, 0))
                room.contents.push(new bulletConstructor(this.x + this.width/2, this.y + this.height/2, -1, 0))
                this.bulletTimer = 0
            }
            // Draw name to type
            drawName(this, this.spellWords[this.spellWordIndex])
            
            // If player input matches name, decrement health
            if (playerInput == this.spellWords[this.spellWordIndex]) {
                damageEnemy(this, 'white', 'lightgrey')
                    // If health is depeleted, kill enemy
                    if (this.health === 0) {
                        killEnemy(this, 'white', 'lightgrey')
                        this.alive = false
                    }
                // Move onto the next spell word
                this.spellWordIndex++
            }
            // Decrement player health if hit
            if (detectHit(this)) {
                if (!hero.justHit) {
                    
                    damangePlayer(this)
                    
                    // Set iframes running
                    setTimeout(iframes, 1500)
                }
            }
        // Chck if bumping against the wall
        wallCheck(this)
    }
}

function bulletConstructor(x, y, xdir, ydir) {
    this.x = x
    this.y = y
    this.color = 'black'
    this.width = 10
    this.height = 10
    this.alive = true
    this.xdir = xdir
    this.ydir = ydir
    this.speed = 20
    this.render = function() {
            // Draw sprite
            circle(this.x, this.y, this.width, this.color)
        }
    this.activate = function() {
        // Move x/y position
        this.x += this.xdir * this.speed
        this.y += this.ydir * this.speed
        
        // Check if the player is hit
        if (detectHit(this)) {
            // Kill enemy if hit
            this.alive = false
            // Decrement health
            if (!hero.justHit) {
                this.xdir = this.xdir * -1
                this.ydir = this.ydir * -1
                damangePlayer(this)
            }
        }
        // Check if bullet has left the viewable map
        if (this.x < 0 || this.x > game.width || this.y < 0 || this.y > game.height) {
            this.alive = false
        }
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
            if (!hero.justHit) {
                this.xdir = this.xdir * -1
                this.ydir = this.ydir * -1
                damangePlayer(this)
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
        ctx.lineWidth = 6
        ctx.strokeStyle = 'white'
        ctx.strokeRect(this.x, this.y, this.width, this.height)
        ctx.fillStyle = 'black'
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.lineWidth = 1
    }
    this.activate = function() {
        // Check if door is locked
        if (this.locked) {
            //If door is locked, check if player is near
            if (room.enemyCount <= 0) {
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
            circle(this.x+(this.width/2), this.y, 29, 'rgba(0,0,0,0)', 'black', 0 - frame, 2 * Math.PI + frame, [5, 5])
            // Expand door as it's unlocked
            if (this.height < 90) {
                this.height++
            }
        }
    }
}

// Constructor function for new chests
function ChestConstructor(x, y, item) {
    this.x = x
    this.y = y
    this.floatIndex = 0
    this.floatArray = [-4, -3, -2, -2, -1, -1, -1, 0, 0, 0, -1, -1, -1, -2, -2, -2, -3, -3, -4]
    this.color = 'yellow'
    this.width = 60
    this.height = 60
    this.locked = true
    this.alive = true
    this.item = item,
    this.textFrameIndex = 0
    this.render = function() {
        ctx.lineWidth = 1
        circle(this.x, this.y + getFloatPos(this), 30, 'hotpink', 'black', 0 - frame, 2 * Math.PI + frame, [5, 5])
    }
    this.activate = function() {
        // Increment the player's health and erase chest
        if (detectHit(this)) {
            if (hero.health < hero.maxhealth) {
                emitParticles(this.x, this.y, 'white', 'pink', 10, 5)
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
    
    // End the function pre-emptively if the player is still in the tutorial rooms
    if (roomIndex <= 2) {
        
        if(roomIndex === 2) {
            array.push(door)
            array.push(chest)
            randomItem = new GhostConstructor(randomRange(100, game.width-100), randomRange(100, game.height-300))
            array.push(randomItem)
            return array
            
        } else if (roomIndex === 1) {
            array.push(door)
            return array
            
        } else if (roomIndex === 0) {
            array.push(door)
            return array
        }
    }
    
    // Otherwise, continue as normal, randomly generating content and pushing it to the room array
    array.push(door)
    array.push(chest)
    
    // Iterate through a loop three times, picking a random option each time to populate into the room
    for (let i = 0; i < 3; i++) {
        // Set random number
        random = Math.floor(Math.random() * 5)
        switch(random) {
            case 1:
                // Add in exclaimer if random num is 1
                array.push(new ExclaimerConstructor(randomRange(100, game.width-100), randomRange(100, game.height-300)))
                array.push(new ExclaimerConstructor(randomRange(100, game.width-100), randomRange(100, game.height-300)))
                break;
            case 2:
                // Add in ghost if random num is 2
                array.push(new GhostConstructor(randomRange(100, game.width-100), randomRange(100, game.height-300)))
                room.enemyCount++
                break;
            case 3:
                // Add in ghost if random num is 3
                array.push(new GhostConstructor(randomRange(100, game.width-100), randomRange(100, game.height-300)))
                room.enemyCount++
                break;
                // Add in period if random num is 4
            case 4: 
                array.push(new PeriodConstructor(randomRange(100, game.width-100), randomRange(100, game.height-300)))
                break;
                // Add in nothing if none are met
            default:
                randomItem = null
                break;
        }
    }
    return array
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
    hero.y = game.height/2 + 180
    // Construct new room and pass it to the current index
    room = new RoomConstructor(roomIndex)
    // Push the newly constructed room to the main room array
    roomArray.push(room)
    // Set gameloop running again
    setTimeout(() => {
        gameInterval = setInterval(gameLoop, 30)
    }, 1000)
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
function moveToObject (obj, target) {
    
    // Grabs player's x/y and moves toward it. The initial funky if statements
    // help smooth the object's movement out - otherwise it jitters a little
    // trying to get precisely on the same value as the player's x/y
    if (obj.x <= target.x + 2 && obj.x >= target.x - 2) {
        obj.x = target.x
    } else if (obj.x < target.x) {
        obj.x += obj.speed
        obj.xdir = 1
    } else {
        obj.x -= obj.speed
        obj.xdir = -1
    }
    
    if (obj.y <= target.y + 2 && obj.y >= target.y - 2) {
        obj.y = target.y 
    } else if (obj.y > target.y) {
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
    hero.justHit = false
}

// Function to play on player death
function killPlayer() {
    clearInterval(gameInterval)
    setTimeout(playerDead, 500)
}

function damangePlayer (obj) {
    // Decrement player health
    hero.health--
    
    // Set iframes on player
    hero.justHit = true
    setTimeout(iframes, 1500)
    
    // Set particle emitter to player's location
    particleSettings.font = '40px'
    particleSettings.startingX = hero.x
    particleSettings.startingY = hero.y
    particleSettings.color = 'hotpink',
    particleSettings.undercolor = 'black'
    // Emit particles
    for (let i = 0; i < 5; i++) {
        new Particle()
    }
    
    pushObject(obj, hero, 4, 10, 100)
}

// Function to push an object
function pushObject (pusher, pushed, force, speed, length) {
    
    let pushPointX = pusher.x + pusher.width/2
    let pushPointY = pusher.y + pusher.height/2
    // Grab object's current speed
    let oldSpeed = pushed.speed
    // Set speed to 0
    pushed.speed = 0
    
    // Push player
    let pushInterval = setInterval(() => {
        
        if (pushed.x + (pushed.width/2) < pushPointX) {
            pushed.x -= force
        } else {
            pushed.x += force
        }
        if (pushed.y + (pushed.height/2) < pushPointY) {
            pushed.y -= force
        } else {
            pushed.y += force
        }  
    }, speed)
    
    setTimeout(() => {
        setTimeout(() => {
            // Set old speed back to the object
            pushed.speed = oldSpeed
        }, 500)
        clearInterval(pushInterval)
    }, length)
}

// Function to damage enemy
function damageEnemy(obj, color, undercolor) {
    // Decrement enemy health
    obj.health--
    // Push enemy
    pushObject(hero, obj, 4, 30, 200)
    // Set particle emitter to player's location
    emitParticles(obj.x + (obj.width/2), obj.y + (obj.height/2), color, undercolor, 5, 20)
}

function killEnemy(obj, color, undercolor) {
    // Decrement enemy room count
    room.enemyCount--
    // Set particle emitter to player's location
    emitParticles(obj.x + (obj.width/2), obj.y + (obj.height/2), color, undercolor, 20, 40)
}

//================================================
//
//          Input Functions
//
//================================================

// Checks which direction the player is trying to move in, and moves them there
function movementHandler () {
    
    if (moveObject.down === true || moveObject.bottomleft === true || moveObject.bottomright === true) {
             hero.y += 5
             hero.ydir = 1
         } 
    if (moveObject.up === true || moveObject.topleft === true || moveObject.topright === true) {
             hero.y -= 5
             hero.ydir = -1
         } 
    if (moveObject.right === true || moveObject.topright === true || moveObject.bottomright === true) {
             hero.x += 5
             hero.xdir = 1
         } 
    if (moveObject.left === true || moveObject.topleft === true || moveObject.bottomleft === true) {
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
     if (e.key == '8') {
             e.preventDefault()
             moveObject.up = true
             hero.ydir = -1
         } 
    if (e.key == '2') {
             e.preventDefault()
             moveObject.down = true
             hero.ydir = 1
         } 
    if (e.key == '4') {
             e.preventDefault()
             moveObject.left = true
             hero.sprite = document.getElementById("madgeFlipped")
             hero.xdir = -1
         } 
    if (e.key == '6') {
             e.preventDefault()
             moveObject.right = true
             hero.sprite = document.getElementById("madge")
             hero.xdir = 1
         }
    if (e.key == '3') {
             e.preventDefault()
             moveObject.bottomright = true
             hero.sprite = document.getElementById("madge")
             hero.ydir = 1
             hero.xdir = 1
         } 
    if (e.key == '1') {
             e.preventDefault()
             moveObject.bottomleft = true
             hero.sprite = document.getElementById("madgeFlipped")
             hero.ydir = 1
             hero.xdir = -1
         } 
    if (e.key == '7') {
             e.preventDefault()
             moveObject.topleft = true
             hero.sprite = document.getElementById("madgeFlipped")
             hero.ydir = -1
             hero.xdir = -1
         } 
    if (e.key == '9') {
             e.preventDefault()
             moveObject.topright = true
             hero.sprite = document.getElementById("madge")
             hero.ydir = -1
             hero.xdir =  1
         }
 })

 document.addEventListener('keyup', e => {
     // Prevent default, so that arrow keys do not interrupt typing or move the cursor
     if (e.key == '8') {
             e.preventDefault()
             moveObject.up = false
             hero.ydir = 0
         } 
    if (e.key == '2') {
             e.preventDefault()
             moveObject.down = false
             hero.ydir = 0
         } 
    if (e.key == '4') {
             e.preventDefault()
             moveObject.left = false
             hero.xdir = 0
         } 
    if (e.key == '6') {
             e.preventDefault()
             moveObject.right = false
             hero.xdir = 0
         }
     if (e.key == '3') {
             e.preventDefault()
             moveObject.bottomright = false
             hero.ydir = 0
             hero.xdir = 0
         } 
    if (e.key == '1') {
             e.preventDefault()
             moveObject.bottomleft = false
             hero.ydir = 0
             hero.xdir = 0
         } 
    if (e.key == '7') {
             e.preventDefault()
             moveObject.topleft = false
             hero.ydir = 0
             hero.xdir = 0
         } 
    if (e.key == '9') {
             e.preventDefault()
             moveObject.topright = false
             hero.ydir =  0
             hero.xdir =  0
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
        // Create trail between starting position and end position
        for (let i = 0; i < 10; i++) {
                ctx.drawImage(hero.sprite, hero.x + hero.hitboxX + (20 * i * hero.xdir), hero.y + hero.hitboxY + (20 * i * hero.ydir))
            }  
        // Move player
        hero.x = hero.x + (hero.xdir * 200)
        hero.y = hero.y + (hero.ydir * 200)
    }
})

//================================================
//
//          Particle functions
//
//================================================

let particles = {}
let particleIndex = 0
let particleSettings = {
    density: 5,
    particleSize: 5,
    startingX: 0,
    startingY: 0,
    gravity: .5,
    maxLife: 100,
    color: 'hotpink',
    undercolor: 'black',
    opacity: 1,
    fontSize: '20',
    font: 'serif',
    groundLevel: game.height,
    leftwall: 0,
    rightwall: game.width
}

function Particle() {
        this.x = particleSettings.startingX
        this.y = particleSettings.startingY
        this.groundLevel = this.y + randomRange(-100, 300)
        this.color = particleSettings.color
        this.undercolor = particleSettings.undercolor
        this.font = particleSettings.font
        this.fontSize = particleSettings.fontSize
        this.vx = randomRange(-5, 5)
        this.vy = randomRange(-5, -10)
        this.letter = selectRandom(letterArray)
        
        particleIndex++
        particles[particleIndex] = this
        this.id = particleIndex
        this.life = 0
        this.maxLife = particleSettings.maxLife
        this.opacity = 1
}

Particle.prototype.draw = function() {
    this.x += this.vx
    this.y += this.vy
    this.life++
    
    if (this.y + particleSettings.particleSize > this.groundLevel) {
        this.vy *= -0.6
        this.vx *= 0.75
        this.y = this.groundLevel - particleSettings.particleSize
    }

    this.vy += particleSettings.gravity
    this.life++
    if (this.opacity > .02) {
        this.opacity -= .02
    }
    
    ctx.globalAlpha = this.opacity
    ctx.font = '20px serif'
    ctx.fillStyle = this.undercolor
    ctx.fillText(this.letter, this.x, this.y+3)
    ctx.fillStyle = this.color
    ctx.fillText(this.letter, this.x, this.y)
    ctx.globalAlpha = 1
    
    if (this.life >= this.maxLife) {
        delete particles[this.id]
    }
}

function emitParticles (x, y, color, undercolor, amount, size) {
    particleSettings.font = size + 'px'
    particleSettings.startingX = x
    particleSettings.startingY = y
    particleSettings.color = color
    particleSettings.undercolor = undercolor
    // Emit particles
    for (let i = 0; i < amount; i++) {
        new Particle()
    }
}

//================================================
//
//          Game Over Functions
//
//================================================

function playerDead() {
    // Change title settings to the gameover menu
    titleSettings.gradient1Red = 0
    titleSettings.gradient1Green = 0
    titleSettings.gradient1Blue = 0
    titleSettings.gradient1Alpha = 0
    titleSettings.gradient2Red = 0
    titleSettings.gradient2Green = 0
    titleSettings.gradient2Blue = 0
    titleSettings.gradient2Alpha = 1
    titleSettings.textColor = 'white'
    titleSettings.textUndercolor = 'black'
    titleSettings.textFont = '80px Londrina Solid'
    titleSettings.titleString = 'GAME OVER'
    titleSettings.circleFill = 'black'
    titleSettings.circleStroke = 'white'
    titleSettings.startString = '- Restart? -'
    titleSettings.startColor = 'hotpink'
    
    // Reset player
    hero.maxhealth = 3
    hero.health = hero.maxhealth
    
    // Start gameOver loop
    gameInterval = setInterval(gameOverLoop, 30)
}

function gameOverLoop() {
    
        frame++
        //Clear board
        ctx.clearRect(0, 0, game.width, game.height)
    
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, game.width, game.height)
    
        for (var i in particles) {
          particles[i].draw();
        }
    
        drawGradient()
    
    drawCircle()
    
    drawTitle()
    
    drawStartText()
    
    emitParticles(randomRange(0, game.width), randomRange(0, game.height), 'white', 'white', 2, 20)
    
    if (frame === 750) {
        frame = 0
    }
}

//================================================
//
//          Title functions/loop
//
//================================================

// Initialize gradient
let gradient
// Initialize mouseover
let mouseover
// Object to hold variables for the title screen
let titleSettings = {//Background gradient
                     gradient1Red: 255,
                     gradient1Green: 255,
                     gradient1Blue: 255,
                     gradient1Alpha: 0,
    
                     // Gradient 2
                     gradient2Red: 255,
                     gradient2Green: 255,
                     gradient2Blue: 255,
                     gradient2Alpha: 1,
    
                    // Title text specific
                     textX: game.width/2,
                     textY: 300,
                     textCeiling: 297,
                     textFloor: 302,
                     textIncrease: false,
                     textColor: 'black',
                     textUndercolor: 'white',
                     textFont: '50px Londrina Solid',
                     titleString: 'SPELL CHECKERS',
                    
                     // Background circles specific
                     circleX: game.width/2,
                     circleY: 280,
                     circleRadius: 150,
                     circleFill: 'white',
                     circleStroke: 'black',
                     linedash: [5, 5],
    
                     // Background scroll specific
                     scrollIndex: 0,
                     scrollColor: 'lightgrey',
                     scrollFont: '20px serif',
    
                     // Start text specific
                     startString: '- Welcome! -',
                     startFont: '30px serif',
                     startColor: 'grey',
                     startX: game.width/2,
                     startY: 360,
                     startAlpha: 0,
                     startAnimate: false,
                     startFinished: false,
                     startCeiling: 350,
    
                     // Option bank
                     optionX: game.width/2,
                     optionY: 500,
                     box1Height: 30,
                     box1size: 20,
                     box1y: 470,
                     box2Height: 30,
                     box2size: 20,
                     box2y: 520,
                     box3Height: 30,
                     box3size: 20,
                     box3y: 570,
}

let leftHandMode = false

function addHover() {
    game.addEventListener('mousemove', (e) => {
        if(e.offsetX > 450 && e.offsetX < 750 && e.offsetY > 470 && e.offsetY < 510) {
            if (titleSettings.box1Height < 40) {
                titleSettings.box1Height++
                titleSettings.box1y -= .5
            } 
        } else if (titleSettings.box1Height > 30){
                titleSettings.box1Height--
                titleSettings.box1y += .5
        }
        
        if(e.offsetX > 450 && e.offsetX < 750 && e.offsetY > 510 && e.offsetY < 560) {
            if (titleSettings.box2Height < 40) {
                titleSettings.box2Height++
                titleSettings.box2y -= .5
            } 
        } else if (titleSettings.box2Height > 30){
                titleSettings.box2Height--
                titleSettings.box2y += .5
        }
        
        if(e.offsetX > 450 && e.offsetX < 750 && e.offsetY > 560 && e.offsetY < 600) {
            if (titleSettings.box3Height < 40) {
                titleSettings.box3Height++
                titleSettings.box3y -= .5
            } 
        } else if (titleSettings.box3Height > 30){
                titleSettings.box3Height--
                titleSettings.box3y += .5
        } 
    })
}

function addClick() {
   // Start game if clicked
    game.addEventListener('click', (e) => {
        
        if(e.offsetX > 450 && e.offsetX < 750 && e.offsetY > 470 && e.offsetY < 510) {
            console.log('clicked1')
            setGradient()
            roomIndex = -1
            moveToNextRoom()
            
        }
        
        if(e.offsetX > 450 && e.offsetX < 750 && e.offsetY > 510 && e.offsetY < 560) {
            console.log('clicked2')
            setGradient()
            roomIndex = 3
            moveToNextRoom()
        }
        
        if(e.offsetX > 450 && e.offsetX < 750 && e.offsetY > 560 && e.offsetY < 600) {
            if (leftHandMode) {
                spellWords = spellWordsRight
                leftHandMode = false
            } else {
                spellWords = spellWordsLeft
                leftHandMode = true
            }
        }
    }) 
}

// Function to listen for a mouseover on the title text
game.addEventListener('mousemove', (e) => {
    if (e.x > titleSettings.circleX - titleSettings.circleRadius
        && e.x < titleSettings.circleX + titleSettings.circleRadius 
        && e.y > titleSettings.circleY - titleSettings.circleRadius 
        && e.y < titleSettings.circleY + titleSettings.circleRadius 
        && !titleSettings.startFinished) {
            titleSettings.startAnimate = true
    } 
})

function setGradient() {
    titleSettings.gradient1Red = 255
    titleSettings.gradient1Green = 255
    titleSettings.gradient1Blue = 255
    titleSettings.gradient1Alpha = 0
    titleSettings.gradient2Red = 255
    titleSettings.gradient2Green = 255
    titleSettings.gradient2Blue = 255
}

// Draw the "Start game!" which flies up when the mouse hovers over the title area
function drawStartText() {
    if (titleSettings.startAnimate) {
        if (titleSettings.startY > titleSettings.startCeiling) {
        titleSettings.startY--
        titleSettings.optionY--
    }
    
    ctx.fillStyle = 'black'
            ctx.fillRect(titleSettings.optionX-titleSettings.circleRadius, titleSettings.box1y, titleSettings.circleRadius*2, titleSettings.box1Height)
            drawFillText('Play tutorial', titleSettings.optionX, titleSettings.optionY, 'white', 'serif', titleSettings.box1size, 'center')
            ctx.fillStyle = 'black'
            ctx.fillRect(titleSettings.optionX-titleSettings.circleRadius, titleSettings.box2y, titleSettings.circleRadius*2, titleSettings.box2Height)
            drawFillText('Play game', titleSettings.optionX, titleSettings.optionY+50, 'white', 'serif', titleSettings.box2size, 'center')
        
            if (leftHandMode) {
                ctx.fillStyle = 'black'
                ctx.fillRect(titleSettings.optionX-titleSettings.circleRadius, titleSettings.box3y, titleSettings.circleRadius*2, titleSettings.box3Height)
                drawFillText('Left-Handed Mode is ON', titleSettings.optionX, titleSettings.optionY+100, 'white', 'serif', titleSettings.box3size, 'center')
            } else {
                ctx.fillStyle = 'white'
                ctx.fillRect(titleSettings.optionX-titleSettings.circleRadius, titleSettings.box3y, titleSettings.circleRadius*2, titleSettings.box3Height)
                drawFillText('Left-Handed Mode is OFF', titleSettings.optionX, titleSettings.optionY+100, 'black', 'serif', titleSettings.box3size, 'center')
            }
        
            ctx.font = titleSettings.startFont
            ctx.fillStyle = titleSettings.startColor
            ctx.fillText(titleSettings.startString, titleSettings.startX, titleSettings.startY) 
    }
}

// Draw the dashed circle behind the text
function drawCircle() {
    ctx.lineWidth = 1
    circle(titleSettings.circleX, titleSettings.circleY, titleSettings.circleRadius, titleSettings.circleFill, titleSettings.circleStroke, 0 - frame, 2 * Math.PI + frame, [5, 5])
}

// Draw gradient
function drawGradient() {
    gradient = ctx.createRadialGradient(titleSettings.textX,300,700,562,300,0)
    gradient.addColorStop(1, `rgba(${titleSettings.gradient1Red}, ${titleSettings.gradient1Green}, ${titleSettings.gradient1Blue}, ${titleSettings.gradient1Alpha})`)
    gradient.addColorStop(0, `rgba(${titleSettings.gradient2Red}, ${titleSettings.gradient2Green}, ${titleSettings.gradient2Blue}, ${titleSettings.gradient2Alpha})`)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, game.width, game.height)
}

// Draw title text
function drawTitle() {
    ctx.font = titleSettings.textFont
    ctx.textAlign = 'center'
    ctx.fillStyle = titleSettings.textUndercolor
    ctx.fillText(titleSettings.titleString, titleSettings.textX, titleSettings.textY + 5)
    ctx.fillStyle = titleSettings.textColor
    ctx.fillText(titleSettings.titleString, titleSettings.textX, titleSettings.textY)
    
    // Animate the text bounce
    if (titleSettings.textY === titleSettings.textFloor) {
        titleSettings.textIncrease = false
    } else if (titleSettings.textY === titleSettings.textCeiling) {
        titleSettings.textIncrease = true
    }
    
    if (frame % 6 === 0) {
        if (titleSettings.textIncrease) {
            titleSettings.textY++
        } else {
            titleSettings.textY--
        }
    }
}

// Draw the strings of letters scrolling up/down in the title screen
function drawBackgroundScroll () {
    ctx.font = titleSettings.scrollFont
    ctx.fillStyle = titleSettings.scrollColor
    for (let j = 0; j < game.width/10; j++) {
        for (let i = 0; i < letterArray.length; i++) {
            if (titleSettings.scrollIndex % 2) {
                ctx.fillText(letterArray[i], (30*j), (30*i)+frame)
                ctx.fillText(letterArray[i], (30*j), (30*i)+frame-750)
            } else {
                ctx.fillText(letterArray[i], (30*j), (30*i)-frame)
                ctx.fillText(letterArray[i], (30*j), (30*i)-frame+750)
            }
        }
        titleSettings.scrollIndex++
    }
    titleSettings.scrollIndex = 0
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
    
    for (var i in particles) {
          particles[i].draw();
        }
    
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
    
    spellWords = spellWordsRight

    addClick()
    addHover()
    
    hero = new HeroConstructor(580, 500, 'hotpink', 60, 60)
    
    gameInterval = setInterval(titleLoop, 30)
    gameStart = true
}

gameBegin()