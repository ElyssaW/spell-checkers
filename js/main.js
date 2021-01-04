// Initial variables
let ctx = game.getContext('2d')
// Set canvas width/height
game.setAttribute('width', 1200)
game.setAttribute('height', 700)
// Curent frame of the game
let frame = 0
// Current room
let roomIndex = -1
// Player's submitted input
let playerInput
// Game Loop Interval
let gameInterval
// Checks if game is on
let gameStart = false
// Initializes array to store player's text input letter by letter
let playerText = []
// Initialize array of objects containing room data
let roomArray = []
// Initialize array of objects containing the word puzzle key/locks
let textArray = [ {doorKey: 'typo', doorStart: 'Welcome to Spell Checker training! Move around with the numpad. Correct this ', doorTypo: 'tpyo', doorEnd: ' to open the door.'},
                  {doorKey: 'space', doorStart: 'Need some space? Move and tap the ', doorTypo: 'scpae', doorEnd: ' bar to dash.'},
                  {doorKey: 'typing', doorStart: 'Wrangle the wild comma by', doorTypo: 'tpying', doorEnd: ' their names'},
                  {doorKey: 'begin', doorStart: 'Well done! Now we can ', doorTypo: 'beign', doorEnd: ' properly'},
                  {doorKey: 'sidewalk', doorStart: 'There is a place where the ', doorTypo: 'sdielkaw', doorEnd: ' ends'},
                  {doorKey: 'before', doorStart: 'And ', doorTypo: 'bforee', doorEnd: ' the street begins,'},
                  {doorKey: 'soft', doorStart: 'And there the grass grows ', doorTypo: 'tofs', doorEnd: ' and white'},
                  {doorKey: 'crimson', doorStart: 'And there the sun burns ', doorTypo: 'crimsin', doorEnd: ' bright'},
                  {doorKey: 'rests', doorStart: 'And there the moon-bird ', doorTypo: 'ersts', doorEnd: ' from his flight'},
                  {doorKey: 'peppermint', doorStart: 'To cool in the ', doorTypo: 'peperpmnit', doorEnd: ' wind.'},
                  {doorKey: 'place', doorStart: 'Let us leave this ', doorTypo: 'palce', doorEnd: ' where the smoke blows black'},
                  {doorKey: 'winds', doorStart: 'And the dark street ', doorTypo: 'wndis', doorEnd: ' and bends'},
                  {doorKey: 'asphalt', doorStart: 'Past the pits where the ', doorTypo: 'ashalpt', doorEnd: ' flowers grow'},
                  {doorKey: 'measured', doorStart: 'We shall walk with a walk that is ', doorTypo: 'mesarued', doorEnd: ' and slow'},
                  {doorKey: 'chalk', doorStart: 'And watch where the ', doorTypo: 'chlak-', doorEnd: 'white arrows go'},
                  {doorKey: 'ends', doorStart: 'To the place where the sidewalk ', doorTypo: 'edns', doorEnd: ''}
                ]
// Initialize array of enemy names
let spellWords = []

// These two arrays hold words containing letters from ONLY the right or left sides of the keyboard, respectively
// If left-handed mode is on, it will pass the Left words to the spellwords array. If it is not, the game defaults
// to right
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
                  'glyph', 'bunko', 'young', 'hunk', 'gulp', 'bijou', 'blimp', 'glib', 'pop',
                  'lollipop', 'polk', 'lol', 'pink', 'mill', 'pill'
]

//================================================
//
//          Title functions/loop
//
//================================================

// Initialize gradient
let gradient
// Initialize mouseover
let mouseover
// Initialize variable to hold left-handed mode
let leftHandMode = false
// Prevents clicking on the menu options if the player is not currently on the menu
let menuClick = true
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

function addHover() {
    game.addEventListener('mousemove', (e) => {
        // Add hover effect for the Play Tutortial button
        if(e.offsetX > 450 && e.offsetX < 750 && e.offsetY > 470 && e.offsetY < 510) {
            if (titleSettings.box1Height < 40) {
                titleSettings.box1Height++
                titleSettings.box1y -= .5
            } 
        } else if (titleSettings.box1Height > 30){
                titleSettings.box1Height--
                titleSettings.box1y += .5
        }
        
        // Add hover effect for the Play Game button
        if(e.offsetX > 450 && e.offsetX < 750 && e.offsetY > 510 && e.offsetY < 560) {
            if (titleSettings.box2Height < 40) {
                titleSettings.box2Height++
                titleSettings.box2y -= .5
            } 
        } else if (titleSettings.box2Height > 30){
                titleSettings.box2Height--
                titleSettings.box2y += .5
        }
        
        // Add hover effect for the Left Handed Mode button
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

// This resets the background gradient to the white fade, which is needed when moving off the game over screen
function setGradient() {
    titleSettings.gradient1Red = 255
    titleSettings.gradient1Green = 255
    titleSettings.gradient1Blue = 255
    titleSettings.gradient1Alpha = 0
    titleSettings.gradient2Red = 255
    titleSettings.gradient2Green = 255
    titleSettings.gradient2Blue = 255
}

function addClick() {
   // Start game if clicked
    game.addEventListener('click', (e) => {
        if (menuClick) {
            // Check if click was on the Play Tutorial button
            if(e.offsetX > 450 && e.offsetX < 750 && e.offsetY > 470 && e.offsetY < 510) {
                console.log('clicked1')
                setGradient()
                roomIndex = -1
                menuClick = false
                moveToNextRoom()
            }

            // Check if click was on the Play Game button
            if(e.offsetX > 450 && e.offsetX < 750 && e.offsetY > 510 && e.offsetY < 560) {
                console.log('clicked2')
                setGradient()
                roomIndex = 3
                menuClick = false
                moveToNextRoom()
            }

            // Check if click was on the left-handed mode button
            if(e.offsetX > 450 && e.offsetX < 750 && e.offsetY > 560 && e.offsetY < 600) {
                if (leftHandMode) {
                    spellWords = spellWordsRight
                    leftHandMode = false
                } else {
                    spellWords = spellWordsLeft
                    leftHandMode = true
                }
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

// Draw the "Welcome!" and options menu which fly up when the mouse hovers over the title area
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
//          Victory Screen Function
//
//================================================

// Makes a grid of letters because I continue to be a child who is entertained by scattering particles
fieldSettings = {
    array: [],
    spacingX: 30,
    spacingY: 30,
    cursorRadius: 100,
    size: 20,
    speed: .2,
}

// Grab mouseX and mouseY so that the grid particles can react to it
let mouseX
let mouseY
game.addEventListener('mousemove', (e)=> {
    mouseX = e.offsetX
    mouseY = e.offsetY
})

// Function to calculate distance between two points, which for this will be the mouse and the particle
function calcDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x1-x2), 2) + Math.pow((y1 - y2), 2))
}

// constructor function for new grid particles
function gridParticle(x, y) {
    this.x = x,
    this.y = y,
    this.letter = selectRandom(letterArray)
    this.vx = 0,
    this.vy = 0,
    this.speed = fieldSettings.speed
    this.color = 'black'
    
    // X and Y the particle will try to return to if displaced
    this.returnX = x,
    this.returnY = y
    
    // Float animation array/index! The sizeable 0's in the middle create a little pause between jumps
    this.floatArray = [-4, -3, -2, -2, -1, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
                       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -1, -2, -2, -2, -3, -3, -4]
    
    // This is set to random so that the particles all jump at different times
    this.floatIndex = randomRange(0, this.floatArray.length)
    this.frame = 0
    
    // Draws particle
    this.render = function() {
        drawFillText(this.letter, this.x, this.y + this.floatArray[this.floatIndex], this.color, 'serif', fieldSettings.size, 'center')
    }
    
    // Function to find distance between the mouse and the particle, and displace it
    this.draw = function() {
        
        // Calculates distance between particle and mouse
        if (calcDistance(this.x, this.y, mouseX, mouseY) < fieldSettings.cursorRadius) {
            
            // Moves particle's x/y
            this.x = this.x + ((this.x - mouseX)) * this.speed
            this.y = this.y + ((this.y - mouseY)) * this.speed
            
        // Checks if the particle is on the edge of the mouse's radius, so that it doesn't continually jump into the
        // mouse's radius only to be pushed back out, making the particle "jump" a lot
        } else if ((this.x <= mouseX-fieldSettings.cursorRadius-fieldSettings.size || 
                    this.x >= mouseX+fieldSettings.cursorRadius+fieldSettings.size || 
                    this.y <= mouseY-fieldSettings.cursorRadius-fieldSettings.size || 
                    this.y >= mouseY+fieldSettings.cursorRadius+fieldSettings.size) &&
                    // And this part of the if statement checks if the particle is not currently at it's preferred x/y
                    (this.x !== this.returnX || this.y !== this.returnY)) {
            
            // Moves the particle to it's preferred x/y
            this.x = this.x + ((this.returnX - this.x)*this.speed)
            this.y = this.y + ((this.returnY - this.y)*this.speed)
        } 
        
        // Resets float animation index if it has reached the end of the array
        if (this.floatIndex === this.floatArray.length-1) {
            this.floatIndex = 0
        } else {
            this.floatIndex++
        }
    }
}

// Draw particles based on how much area it needs to cover (The entire canvas) and how much space should be between them
for (let i = 0; i < (game.width/fieldSettings.spacingX); i++) {
    for (let j = 0; j < (game.height/fieldSettings.spacingY); j++) {
            let parti = new gridParticle(fieldSettings.spacingX*i, fieldSettings.spacingY*j)
            fieldSettings.array.push(parti)  
    }
}

// Run victory screen
function endGameLoop () {
        frame++
        //Clear board
        ctx.clearRect(0, 0, game.width, game.height)

        for (let i =0; i < fieldSettings.array.length; i++) {
            fieldSettings.array[i].render()
            fieldSettings.array[i].draw()
        }
    
        drawGradient()
    
        drawCircle()

        drawTitle()

        if (frame === 750) {
            frame = 0
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
    
    // Reset menu options to accept input
    menuClick = true
    
    // Reset player
    hero.maxhealth = 3
    hero.health = hero.maxhealth
    
    // Start gameOver loop
    gameInterval = setInterval(gameOverLoop, 30)
}

function gameOverLoop() {
    
    // Increment frame
    frame++
    
    //Clear board
    ctx.clearRect(0, 0, game.width, game.height)
    
    // Fill background. The gradient in this loop will be overlapping the
    // particles, so it cannot be solid black or go behind them
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, game.width, game.height)
    
    // Draw particles
    for (var i in particles) {
        particles[i].draw();
    }
    
    // Draw gradient to vignette the edges
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
//          Game Loop
//
//================================================

// Where the magic happens
let gameLoop = () => {
    
    //Clear board
    ctx.clearRect(0, 0, game.width, game.height)
    
   // Draw background text/gradient
    drawBackgroundScroll()
    drawGradient()
    
    // Draw room map
    ctx.drawImage(document.getElementById('dungeoncontinue'), 30, 20)
    
    // Draw particles if any exist
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
    
    // Cheat code to teleport you to the victory screen
    if (playerInput === 'chickendinner') {
        clearInterval(gameInterval)
        titleSettings.textFont = '80px Londrina Solid'
        titleSettings.titleString = 'THE END'
        gameInterval = setInterval(endGameLoop, 30)
    }
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