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
    if ((hero.x+hero.width >= obj.x - threshold && hero.x < obj.x+obj.width + threshold) &&
        (hero.y+hero.height >= obj.y - threshold && hero.y < obj.y+obj.height + threshold)) {
            return true
        } else {
            return false
        }
}