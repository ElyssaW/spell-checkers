console.log('Hello!')// reference DOM elements

let movementDisplay = movement;
let ctx = game.getContext('2d')
let frame = 0

// Set canvas width/height
// Set attribute and get computed style make the game more
// responsive, allowing for clicks and computer graphics to still
// display properly when set
game.setAttribute('width', getComputedStyle(game)['width'])
game.setAttribute('height', getComputedStyle(game)['height'])

// draw filled box
let drawBoxFill = (x, y, size, color) => {
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
}

game.addEventListener('click', e => {
    console.log(e.offsetX, e.offsetY)
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
        obj.y = game.height  - hero.height
        obj.ydir = -10
    }
}

let gameLoop = () => {
    //Clear board
    ctx.clearRect(0, 0, game.width, game.height)
    
    // Increment frame
    frame++
    
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
    // when I press w, the hero moves up
    
    switch(e.key) {
        case 'w':
            hero.y -= 10
            break;
        case 'a':
            hero.x -= 10
            break
        case 's':
            hero.y += 10
            break
        case 'd':
            hero.x += 10
            break
    }
}

 document.addEventListener('keypress', movementHandler)

let gameInterval = setInterval(gameLoop, 30)


