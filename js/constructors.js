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
    this.justHit = false
    this.xdir = 0
    this.ydir = 0
    this.render = function() {
        drawFloatAnim(this)
    }
}

// Constructor function that creates a version of the Common Comma enemy, but for the tutorial
function TutorialConstructor(x, y) {
    this.x = x
    this.y = y
    this.hitboxX = 0
    this.hitboxY = 0
    // Information to handle this particular instance's face
    this.faceNum = randomRange(2, 5)
    this.sprite = document.getElementById('ghostBlank')
    this.face = document.getElementById('ghost'+this.faceNum)
    this.spriteRight = document.getElementById('ghostBlank')
    this.faceRight = document.getElementById('ghost'+this.faceNum)
    this.spriteLeft = document.getElementById('ghostBlankFlipped')
    this.faceLeft = document.getElementById('ghost'+this.faceNum+'Flipped')
    // General information
    this.color = 'grey'
    this.width = 120
    this.height = 120
    this.health = 3
    this.alive = true
    this.xdir = 0
    this.ydir = 0
    this.speed = randomRange(1, 3)
    this.frame = 0
    // Variables to handle which name the player should type
    this.spellWords = [selectRandom(spellWords), selectRandom(spellWords), selectRandom(spellWords)]
    this.spellWordIndex = 0
    // Handles float animation frame
    this.floatArray = [-4, -3, -2, -2, -1, -1, -1, 0, 0, 0, -1, -1, -1, -2, -2, -2, -3, -3, -4]
    this.floatIndex = 0
    // Renders sprite
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
        // Chck if bumping against the wall
        wallCheck(this)
    }
}

// Constructor function for new enemies
function GhostConstructor(x, y) {
    this.x = x
    this.y = y
    this.hitboxX = 0
    this.hitboxY = 0
    // Information to handle this particular instance's face
    this.faceNum = randomRange(2, 5)
    this.sprite = document.getElementById('ghostBlank')
    this.face = document.getElementById('ghost'+this.faceNum)
    this.spriteRight = document.getElementById('ghostBlank')
    this.faceRight = document.getElementById('ghost'+this.faceNum)
    this.spriteLeft = document.getElementById('ghostBlankFlipped')
    this.faceLeft = document.getElementById('ghost'+this.faceNum+'Flipped')
    // General information
    this.color = 'grey'
    this.width = 120
    this.height = 120
    this.health = 3
    this.alive = true
    this.xdir = 0
    this.ydir = 0
    this.speed = randomRange(1, 3)
    this.frame = 0
    // Variables to handle which name the player should type
    this.spellWords = [selectRandom(spellWords), selectRandom(spellWords), selectRandom(spellWords)]
    this.spellWordIndex = 0
    // Handles float animation frame
    this.floatArray = [-4, -3, -2, -2, -1, -1, -1, 0, 0, 0, -1, -1, -1, -2, -2, -2, -3, -3, -4]
    this.floatIndex = 0
    // Renders sprite
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
        // Increment frame
        this.frame++
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
        // Check if near player
        if(detectNear(this, 400)) {
            // Move to player
            moveToObject(this, hero)
            // Decrement player health if hit
            if (detectHit(this)) {
                if (!hero.justHit) {
                    // Run function to decrement player health and run hit animation
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

// This is a new enemy type similar to the ghost, except it spits out bullets periodically
function PeriodConstructor(x, y) {
    this.x = x
    this.y = y
    this.hitboxX = 0
    this.hitboxY = 0
    // Information to handle the enemy's face
    this.faceNum = randomRange(2, 5)
    this.sprite = document.getElementById('periodBlank')
    this.face = document.getElementById('period')
    this.spriteRight = document.getElementById('periodBlank')
    this.faceRight = document.getElementById('period')
    this.spriteLeft = document.getElementById('periodBlankFlipped')
    this.faceLeft = document.getElementById('periodFlipped')
    // General information
    this.color = 'grey'
    this.width = 120
    this.height = 120
    this.health = 3
    this.alive = true
    this.xdir = 0
    this.ydir = 0
    this.speed = randomRange(1, 3)
    this.frame = 0
    this.bulletDir = 0
    // Handles which word the player should type
    this.spellWords = [selectRandom(spellWords), selectRandom(spellWords), selectRandom(spellWords)]
    this.spellWordIndex = 0
    // Handles float animation
    this.floatArray = [-4, -3, -2, -2, -1, -1, -1, 0, 0, 0, -1, -1, -1, -2, -2, -2, -3, -3, -4]
    this.floatIndex = 0
    this.render = function() {
        // Check for direction on ghost
        spriteCheck(this)
        // Draw sprite body
        drawFloatAnim(this)
        // Draw sprite face
        drawSprite(this, this.face)
    }
    this.activate = function() {
            // Increment frame
            this.frame++
            // Move to player
            moveToObject(this, hero)
            // Every 60 frames, release bullets
            if (this.frame % 60 === 0 && this.bulletDir === 0) {
                // Fires diagonally
                room.contents.push(new bulletConstructor(this.x + this.width/2, this.y + this.height/2, 1, 1))
                room.contents.push(new bulletConstructor(this.x + this.width/2, this.y + this.height/2, -1, 1))
                room.contents.push(new bulletConstructor(this.x + this.width/2, this.y + this.height/2, 1, -1))
                room.contents.push(new bulletConstructor(this.x + this.width/2, this.y + this.height/2, -1, -1))
                this.bulletDir = 1
            } else if (this.frame % 60 === 0 && this.bulletDir === 1) {
                // Fires up/down and left/right
                room.contents.push(new bulletConstructor(this.x + this.width/2, this.y + this.height/2, 0, 1))
                room.contents.push(new bulletConstructor(this.x + this.width/2, this.y + this.height/2, 0, -1))
                room.contents.push(new bulletConstructor(this.x + this.width/2, this.y + this.height/2, 1, 0))
                room.contents.push(new bulletConstructor(this.x + this.width/2, this.y + this.height/2, -1, 0))
                this.bulletDir = 0
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
    this.sprite = document.getElementById("exclaimer")
    this.color = 'black'
    this.width = 20
    this.height = 20
    this.alive = true
    this.xdir = randomRange(20, 30)
    this.ydir = randomRange(20, 30)
    this.render = function() {
            // Draw sprite
            ctx.drawImage(this.sprite, this.x, this.y)
        }
    this.activate = function() {
        // Kill the exclaimer if no other enemies persist
        if (room.enemyCount === 0) {
            this.alive = false
        }
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
function DoorConstructor(x, y) {
    this.x = x
    this.y = y
    this.color = 'black'
    this.width = 60
    this.height = 0
    
    this.firstLock = textArray[roomIndex].doorStart
    this.secondLock = textArray[roomIndex].doorEnd
    this.typo = textArray[roomIndex].doorTypo
    this.key = textArray[roomIndex].doorKey
    this.locked = true
    this.alive = true
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
        if (this.locked && room.enemyCount <= 0) {
                // Display typo text
                drawTypo(this, this.firstLock, this.typo, this.secondLock)
                // Only show the door once all enemies are gone
                if (this.height < 10) {
                    this.height++
                }
                // Unlock door
                if (playerInput == this.key) {
                    this.locked = false
                } 
        // If door is unlocked, watch for collision
        } else if (!this.locked && detectHit(this)) {
            // Increment room index
            roomIndex++
            // Increment room index
            moveToNextRoom()
        } else if (!this.locked) {
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
    this.color = 'yellow'
    this.width = 60
    this.height = 60
    this.alive = true
    this.render = function() {
        ctx.lineWidth = 1
        circle(this.x, this.y, 30, 'hotpink', 'black', 0 - frame, 2 * Math.PI + frame, [5, 5])
    }
    this.activate = function() {
        // Increment the player's health and erase chest
        if (detectHit(this)) {
            if (hero.health < hero.maxhealth) {
                emitParticles(this.x, this.y, 'white', 'pink', 10, 5)
                hero.health++
                this.alive = false
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
    // Value to check whether the array already has a Period, for game balance reasons
    let includesPeriod = false
    
    // Each room must contain a door and a chest, so they're generated here
    let door = new DoorConstructor(570, 50)
    let chest = new ChestConstructor(280, 320)
    
    // End the function pre-emptively if the player is still in the tutorial rooms
    if (roomIndex <= 2) {
        
        if(roomIndex === 2) {
            array.push(door)
            array.push(chest)
            randomItem = new TutorialConstructor(randomRange(100, game.width-100), randomRange(100, game.height-300))
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
    // Every room should contain a door and a chest, so those are always generated
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
                break;
                
            case 2:
                // Add in ghost if random num is 2
                array.push(new GhostConstructor(randomRange(100, game.width-100), randomRange(100, game.height-300)))
                room.enemyCount++
                break;
                
            case 3:
                // Checks which room the player is currently on, and populates in harder enemies if they're further along
                if (roomIndex > 10) {
                    array.push(new PeriodConstructor(randomRange(100, game.width-100), randomRange(100, game.height-300)))
                } else {
                    array.push(new GhostConstructor(randomRange(100, game.width-100), randomRange(100, game.height-300)))
                }
                room.enemyCount++
                break;
                
            case 4: 
                // Add in period if random num is 4 and the room doesn't already include a period (Or if the room DOES include a
                // a period, but the player is further along)
                if ((!includesPeriod && roomIndex > 6) || roomIndex > 12) {
                    array.push(new PeriodConstructor(randomRange(100, game.width-100), randomRange(100, game.height-300)))
                    includesPeriod = true
                    room.enemyCount++
                } 
                break;
        }
    }
    // Return array of enemies/objects
    return array
}
