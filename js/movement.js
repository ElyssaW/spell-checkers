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