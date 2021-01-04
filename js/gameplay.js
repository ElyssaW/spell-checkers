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
    
    // Reset menu options to accept input
    menuClick = true
    
    // Reset player
    hero.maxhealth = 3
    hero.health = hero.maxhealth
    
    // Start gameOver loop
    gameInterval = setInterval(gameOverLoop, 30)
    
    setTimeout(playerDead, 500)
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
    
    // Set speed to 0, to prevent them from moving on their own
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