console.log('Hello!')// reference DOM elements

// Accept input from player

// Compare input string to correct string

// Initial variables
let ctx = game.getContext('2d')
let frame = 0
let playerHealth = 0

// Track whether an arrow key is pressed. This way, when the player starts typing, and their keypress events
// interrupt the arrow keys' repeating fires, the player will continue to move smoothly
let keyDown = false
let keyValue

// Set canvas width/height
// Set attribute and get computed style make the game more
// responsive, allowing for clicks and computer graphics to still
// display properly when set
game.setAttribute('width', getComputedStyle(game)['width'])
game.setAttribute('height', getComputedStyle(game)['height'])

// Function to check player text against correct string
    // Accept player input, string input
    // Check if correct
        // If correct, return true

        // If not, deduct health
        // Return false

// Add event listener for form submission
document.querySelector('form').addEventListener('submit', (e)=> {
    
    // Prevent dafult refresh
    e.preventDefault()
    
    // Grab player input from box
    let playerInput = textInput.value
    console.log(playerInput)
    
    // Reset text input box to empty
    textInput.value = ''
})

// Constructor function creates an empty object and assigns passed
// values to it
// Does not need a return statement when paired with "new"
// ogre.render() or similar must be used to make object appear
function Crawler(x, y, color, width, height) {
    this.x = x
    this.y = y
    this.color = color
    this.width = width
    this.height = height
    this.alive = true
    this.xdir = 0
    this.ydir = 0
    this.frameIndex = 0
    this.render = function() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}

let hero = new Crawler(150, 150, 'hotpink', 60, 60)
let ogre = new Crawler(60, 60, '#bada55', 40, 80)

// Make ogre walk in random direction
function randomWalk (obj) {
    // Pick random direction value - +x, -x, +y, -y
    let randDir = Math.floor(Math.random() * 5)
    
    // Set object's x/y direction to zero
    obj.xdir = 0
    obj.ydir = 0
    
    // Assign object's current direction based on
    // the random value received above
     switch(randDir) {
        case 1:
            obj.ydir -= 2
            break;
        case 2:
            obj.xdir -= 2
            break
        case 3:
            obj.ydir += 2
            break
        case 4:
            obj.xdir += 2
            break
        default:
        
    }
    
    console.log(randDir)
    console.log(obj.xdir)
}

function objectWalk(obj) {
    
    // Every 30 frames, assign the
    // object a new direction
    if (obj.frameIndex === 30) {
        obj.frameIndex = 0
        randomWalk(obj)
    } else {
        obj.frameIndex++
    }
    
    // Take object's x/y direction
    // Add x/y direction to object's x/y
    obj.x += obj.xdir
    obj.y += obj.ydir
}

function moveToPlayer () {
    // Get player's x and y
    // Check if x is greater
        // Move +x if yes, -x if no
    // Check if y is great
        // Move +y if yes, -y if no
}

function wallCheck(obj) {
    // Check if player is going over the border
    if (obj.x < 0) {
        obj.x = 0
        obj.xdir = 10
    } else if (obj.x+obj.width > game.width) {
        obj.x = game.width  - obj.width
        obj.xdir = -10
    }
    
    if (obj.y < 0) {
        obj.y = 0
        obj.ydir = 10
    } else if (obj.y+obj.height > game.height) {
        obj.y = game.height  - obj.height
        obj.ydir = -10
    }
}

let gameLoop = () => {
    //Clear board
    ctx.clearRect(0, 0, game.width, game.height)
    
    // Increment frame
    frame++
    
    // Move player
    movementHandler(keyValue)
    
    // Check if player is going over the border
    if (hero.x < 0) {
        hero.x = 0
    } else if (hero.x+hero.width > game.width) {
        hero.x = game.width  - hero.width
    }
    
    if (hero.y < 0) {
        hero.y = 0
    } else if (hero.y+hero.height > game.height) {
        hero.y = game.height  - hero.height
    }

    // check if Ogre is alive
    if (ogre.alive) {
        // Render Ogre
        ogre.render()
        
        // Detect hit
        if (detectHit(ogre)) {
            ogre.alive = false
        }
        
        
        // Move ogre and check for wall
        objectWalk(ogre)
        wallCheck(ogre)
    }
    // Render hero
    hero.render()
}

// Four corner collision detection
let detectHit = (obj) => {
        // Check top left corner
    if (((hero.x > obj.x && hero.x < obj.x+obj.width) &&
        (hero.y > ogre.y && hero.y < ogre.y+ogre.height)) ||
        
        // Check top right corner
        ((hero.x+hero.width > obj.x && hero.x < obj.x) &&
        (hero.y > obj.y && hero.y < obj.y+obj.height)) ||
        
        // Check bottom right corner
        ((hero.x < obj.x && hero.x+hero.width > obj.x) &&
        (hero.y+hero.height > ogre.y && hero.y < ogre.y)) ||
        
        // Check bottom left corner
        ((hero.x > obj.x && hero.x < obj.x+obj.width) &&
        (hero.y < obj.y && hero.y+hero.height > obj.y))) {
            return true
        }
        
}

let movementHandler = e => {
    
    if (keyDown) {
        switch(keyValue) {
            case 'ArrowUp':
                hero.y -= 5
                break;
            case 'ArrowLeft':
                hero.x -= 5
                break
            case 'ArrowDown':
                hero.y += 5
                break
            case 'ArrowRight':
                hero.x += 5
                break
        }
    }
}

// document.addEventListener('keydown', e => {
//     // Prevent default, so that arrow keys do not interrupt typing or move the cursor
//     if (e.key == 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowDown')
//         {
//             e.preventDefault()
//             keyDown = true
//             keyValue = e
//             
//            // Fire movement handler
//            movementHandler(e)
//             
//         } else if (keyDown) {
//             console.log(keyDown)
//             movementHandler(keyValue)
//         }
// })
//
// Set keyDown to false when key is released
// document.addEventListener('keyup', e => {
//     // Prevent default, so that arrow keys do not interrupt typing or move the cursor
//     if (e.key == 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowDown')
//         {
//             e.preventDefault()
//             keyDown = false;
//         }
// })

// This duo of functions essentially replicates the keypress events for the arrow keys.
// THe typical keypress event gets interrupted by typing - meaning, the hero will stop
// moving when the player types, until the player moves them again. This tracks the arrowkeys
// by keydown/keyup instead, so that the computer will continue accepting movement input even
// while the keyboard is being used for typing
document.addEventListener('keydown', e => {
     // Prevent default, so that arrow keys do not interrupt typing or move the cursor
     if (e.key == 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowDown')
         {
             e.preventDefault()
             keyDown = true
             keyValue = e.key
         }
 })

 document.addEventListener('keyup', e => {
     // Prevent default, so that arrow keys do not interrupt typing or move the cursor
     if (e.key == 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowDown')
         {
             e.preventDefault()
             keyDown = false
         }
 })

let gameInterval = setInterval(gameLoop, 30)


