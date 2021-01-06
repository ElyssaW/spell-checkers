//================================================
//
//          Draw Functions
//
//================================================

// Draw sprite without float value
function drawSprite (obj, sprite) {
    ctx.drawImage(sprite, obj.x, obj.y)
}

// Draw the current word-to-type above the enemy's head
function drawName (obj, string1) {
    drawStrokeText(string1, obj.x+(obj.width/2), obj.y - 12, 'white', 'Bungee', 20, 'center')
    drawFillText(string1, obj.x+(obj.width/2), obj.y - 14, 'black', 'Bungee', 20, 'center')
}

// Function to draw health for the player
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

// Function to damage the player, and fire all accompanying animations
function damangePlayer (obj) {
    // Decrement player health
    hero.health--
    
    // Set iframes on player
    hero.justHit = true
    setTimeout(iframes, 1500)
    
    // Set particle emitter to player's location
    emitParticles(hero.x + (hero.width/2), hero.y + (hero.height/2), 'hotpink', 'black', 20, 40)
    
    // push that loser
    pushObject(obj, hero, 4, 10, 100)
}

// Function to push an object
function pushObject (pusher, pushed, force, speed, length) {
    
    // Get the center of the pusher object
    let pushPointX = pusher.x + pusher.width/2
    let pushPointY = pusher.y + pusher.height/2
    
    // Grab object's current speed
    let oldSpeed = pushed.speed
    
    // Set speed to 0, to prevent them from moving on their own. Helps the pushed object appear "dazed" brief;y
    pushed.speed = 0
    
    // Push object, set inside an interval function so that it pushes gradually, rather than
    // just teleporting the object
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
    
    // Time out to end the interval
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


// Function to move the player to the next room
function moveToNextRoom() {
    // Stop game loop
    clearInterval(gameInterval)
    
    // Clear canvas
    ctx.clearRect(0, 0, game.width, game.height)
    
    // End the game if the player has reached the end of the key/door text array
    if (roomIndex === textArray.length) {
        room = {}
        moveToWin()
    } else {
        // Throw a view over the board
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, game.width, game.height)
        
        // Reset player input
        playerInput = []
        
        // Place the player at the bottom of the room
        hero.x = game.width/2
        hero.y = game.height/2 + 180
        
        // Construct new room and pass it to the current index
        room = new RoomConstructor(roomIndex)
        
        // Set gameloop running again
        setTimeout(() => {
            gameInterval = setInterval(gameLoop, 30)
        }, 1000)
    }
}

//================================================
//
//          Movement functions
//
//================================================

// Function to make object move randomly around the canvas
function randomWalk(obj) {
    // Every 60 frames, assign the
    // object a new direction
    if (obj.frame % 60 === 0) {
        obj.xdir = randomRange(-2, 2)
        obj.ydir = randomRange(-2, 2)
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
    if (hero.x + hero.width >= obj.x &&
        hero.x <= obj.x + obj.width &&
        hero.y <= obj.y + obj.height &&
        hero.y + hero.height >= obj.y) {
            return true
        } else {
            return false
        }
}

// Detects nearness
let detectNear = (obj, threshold) => {
    let dist = Math.sqrt(Math.pow((hero.x-obj.x), 2) + Math.pow((hero.y - obj.y), 2))
    
    if (dist < threshold) {
            return true
        } else {
            return false
        }
}