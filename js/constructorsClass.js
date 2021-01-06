//================================================
//
//          Constructor Functions
//
//================================================

class Construct {
    constructor(x, y, width, height, color) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        this.alive = true
        this.frame = 0
    }
}

class Mover extends Construct {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color)
        this.xdir = 0
        this.ydir = 0
        this.speed
        this.health = 3
    }
}

class Hero extends Mover {
    constructor(x, y, width, height, color, hitboxX, hitboxY) {
        super(x, y, width, height, color)
        
        this.hitboxX = hitboxX
        this.hitboxY = hitboxY
        this.floatArray = [-4, -3, -2, -2, -1, -1, -1, 0, 0, 0, -1, -1, -1, -2, -2, -2, -3, -3, -4]
        this.floatIndex = 0
        this.sprite = document.getElementById("madge")
        this.maxhealth = 3
        this.justHit = false
        this.render = function() {
            this.floatIndex++
            if (this.floatIndex === this.floatArray.length) {
                this.floatIndex = 0
            }
            ctx.drawImage(this.sprite, this.x + this.hitboxX, this.y + this.hitboxY + this.floatArray[this.floatIndex])
        }
    }
}

class Comma extends Mover {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color)
        
        this.faceNum = randomRange(2, 5)
        this.sprite = document.getElementById('ghostBlank')
        this.face = document.getElementById('ghost'+this.faceNum)
        this.spriteRight = document.getElementById('ghostBlank')
        this.faceRight = document.getElementById('ghost'+this.faceNum)
        this.spriteLeft = document.getElementById('ghostBlankFlipped')
        this.faceLeft = document.getElementById('ghost'+this.faceNum+'Flipped')
        
        this.speed = randomRange(1, 3)
        
        // Variables to handle which name the player should type
        this.spellWords = [selectRandom(spellWords), selectRandom(spellWords), selectRandom(spellWords)]
        this.spellWordIndex = 0
        
        // Handles float animation frame
        this.floatArray = [-4, -3, -2, -2, -1, -1, -1, 0, 0, 0, -1, -1, -1, -2, -2, -2, -3, -3, -4]
        this.floatIndex = 0
        
        this.special = function(){}
        
        this.render = function() {
            if (this.xdir < 0) {
                this.face = this.faceLeft
                this.sprite = this.spriteLeft
            } else if (this.xdir > 0) {
                this.face = this.faceRight
                this.sprite = this.spriteRight
            }
            
            this.floatIndex++
            if (this.floatIndex === this.floatArray.length) {
                this.floatIndex = 0
            }
            
            ctx.drawImage(this.sprite, this.x, this.y + this.floatArray[this.floatIndex])
            ctx.drawImage(this.face, this.x, this.y)
        }
        
        this.activate = function() {
            // Increment frame
            this.frame++
            // Execute special function, in case it is filled by later classes
            this.special()
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
}

class TutComma extends Comma {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color)
        
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
}

class Period extends Comma {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color)
        
        this.sprite = document.getElementById('periodBlank')
        this.face = document.getElementById('period')
        this.spriteRight = document.getElementById('periodBlank')
        this.faceRight = document.getElementById('period')
        this.spriteLeft = document.getElementById('periodBlankFlipped')
        this.faceLeft = document.getElementById('periodFlipped')
        this.bulletDir = 0
        
        this.special = function() {
            if (this.frame % 60 === 0 && this.bulletDir === 0) {
                // Fires diagonally
                room.contents.push(new Bullet(this.x + this.width/2, this.y + this.height/2, 10, 10, 'black', 1, 1))
                room.contents.push(new Bullet(this.x + this.width/2, this.y + this.height/2, 10, 10, 'black', -1, 1))
                room.contents.push(new Bullet(this.x + this.width/2, this.y + this.height/2, 10, 10, 'black', 1, -1))
                room.contents.push(new Bullet(this.x + this.width/2, this.y + this.height/2, 10, 10, 'black', -1, -1))
                this.bulletDir = 1
            } else if (this.frame % 60 === 0 && this.bulletDir === 1) {
                // Fires up/down and left/right
                room.contents.push(new Bullet(this.x + this.width/2, this.y + this.height/2, 10, 10, 'black', 0, 1))
                room.contents.push(new Bullet(this.x + this.width/2, this.y + this.height/2, 10, 10, 'black', 0, -1))
                room.contents.push(new Bullet(this.x + this.width/2, this.y + this.height/2, 10, 10, 'black', 1, 0))
                room.contents.push(new Bullet(this.x + this.width/2, this.y + this.height/2, 10, 10, 'black', -1, 0))
                this.bulletDir = 0
            }
        }
    }
}

class Bullet extends Mover {
    constructor(x, y, width, height, color, xdir, ydir) {
        super(x, y, width, height, color)
        
        this.xdir = xdir
        this.ydir = ydir
        this.speed = 20
        this.render = function() {
            circle(this.x, this.y, this.height, this.color, 'white')
        }
        this.collide = function () {
            this.alive = false
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
            if (this.x <= 0 || this.x >= game.width || this.y <= 0 || this.y >= game.height) {
                this.collide()
            }
        }
    }
}

class Exclaimer extends Bullet {
    constructor(x, y, width, height, color, xdir, ydir) {
        super(x, y, width, height, color)
        
        this.sprite = document.getElementById("exclaimer")
        this.render = function () {
            ctx.drawImage(this.sprite, this.x, this.y)
        }
        
        this.collide = function () {
            wallCheck(this)
        }
    }
}

class Door extends Construct {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color)
        
        this.firstLock = textArray[roomIndex].doorStart
        this.secondLock = textArray[roomIndex].doorEnd
        this.typo = textArray[roomIndex].doorTypo
        this.key = textArray[roomIndex].doorKey
        this.locked = true
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
}

class Chest extends Construct {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color)
        
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
    let door = new Door(570, 50, 60, 0, 'black')
    let chest = new Chest(280, 320, 40, 40, 'hotpink')
    
    // End the function pre-emptively if the player is still in the tutorial rooms
    if (roomIndex <= 2) {
        
        if(roomIndex === 2) {
            array.push(door)
            array.push(chest)
            randomItem = new TutComma(randomRange(100, game.width-100), randomRange(100, game.height-300), 120, 120, 'grey')
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
                array.push(new Exclaimer(randomRange(100, game.width-100), randomRange(100, game.height-300), 10, 10, 'black'))
                break;
                
            case 2:
                // Add in ghost if random num is 2
                array.push(new Comma(randomRange(100, game.width-100), randomRange(100, game.height-300), 120, 120, 'grey'))
                room.enemyCount++
                break;
                
            case 3:
                // Checks which room the player is currently on, and populates in harder enemies if they're further along
                if (roomIndex > 10) {
                    array.push(new Period(randomRange(100, game.width-100), randomRange(100, game.height-300), 120, 120, 'grey'))
                } else {
                    array.push(new Comma(randomRange(100, game.width-100), randomRange(100, game.height-300), 120, 120, 'grey'))
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