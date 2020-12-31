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
// Checks if the player was hit recently, so that they can have
// iframes between hits
let playerJustHit = false
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

game.setAttribute('width', 1200)
game.setAttribute('height', 700)
ctx.drawImage(document.getElementById('dungeoncontinue'), 30, 20)

function selectRandom (randomArray) {
    return randomArray[Math.floor(Math.random() * randomArray.length)]
}

let gameOver = {backgroundFinished: false,
               bigTextFinished: false,
               bigTextY: game.height/2+100,
               bigtextopacity: 0,
               bigTextCeiling: game.width/2 - 100,
               startOverFinished: false,
               startOverOpacity: 0
               }

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
    particleSettings.font = '20px serif'
    particleSettings.startingX = x
    particleSettings.startingY = y
    particleSettings.color = color
    particleSettings.undercolor = undercolor
    // Emit particles
    for (let i = 0; i < amount; i++) {
        new Particle()
    }
}

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

// Select random number from given range
function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

let titleSettings = {//Background gradient
                     gradient1Red: 0,
                     gradient1Green: 0,
                     gradient1Blue: 0,
                     gradient1Alpha: 1,
    
                     // Gradient 2
                     gradient2Red: 0,
                     gradient2Green: 0,
                     gradient2Blue: 0,
                     gradient2Alpha: 1,
    
                    // Title text specific
                     textX: game.width/2,
                     textY: 300,
                     textCeiling: 297,
                     textFloor: 302,
                     textIncrease: false,
                     textColor: 'black',
                     textUndercolor: 'white',
                     textFont: '80px Londrina Solid',
                     titleString: 'GAME OVER',
                    
                     // Background circles specific
                     circleX: game.width/2,
                     circleY: 280,
                     circleRadius: 150,
                     circleFill: 'black',
                     circleStroke: 'white',
                     linedash: [5, 5],
    
                     // Background scroll specific
                     scrollIndex: 0,
                     scrollColor: 'lightgrey',
                     scrollFont: '20px serif',
    
                     // Start text specific
                     startString: '- Restart? -',
                     startFont: '30px serif',
                     startColor: 'hotpink',
                     startX: game.width/2,
                     startY: 360,
                     startAlpha: 0,
                     startAnimate: false,
                     startFinished: false,
                     startCeiling: 350
}

// Function to listen for a mouseover on the title text
document.addEventListener('mousemove', (e) => {
    if (e.x > titleSettings.circleX - titleSettings.circleRadius
        && e.x < titleSettings.circleX + titleSettings.circleRadius 
        && e.y > titleSettings.circleY - titleSettings.circleRadius 
        && e.y < titleSettings.circleY + titleSettings.circleRadius 
        && !titleSettings.startFinished) {
            titleSettings.startAnimate = true
    } 
})

// Draw the "Start game!" which flies up when the mouse hovers over the title area
function drawStartText() {
    if (!titleSettings.startFinished && titleSettings.startAnimate) {
            titleSettings.startY--
            ctx.font = titleSettings.startFont
            ctx.fillStyle = titleSettings.startColor
            ctx.fillText(titleSettings.startString, game.width/2, titleSettings.startY)
            
            if (titleSettings.startY === titleSettings.startCeiling) {
                titleSettings.startFinished = true
            }
    }  else if (titleSettings.startFinished) {
            ctx.font = titleSettings.startFont
            ctx.fillStyle = titleSettings.startColor
            ctx.fillText(titleSettings.startString, titleSettings.startX, titleSettings.startY) 
    } 
}

// Draw the dashed circle behind the text
function drawCircle() {
    circle(titleSettings.circleX, titleSettings.circleY, titleSettings.circleRadius, titleSettings.circleFill, titleSettings.circleStroke, 0 - frame, 2 * Math.PI + frame, [5, 5])
}

// Draw gradient
function drawGradient() {
    gradient = ctx.createRadialGradient(titleSettings.textX,300,700,562,300,0)
    gradient.addColorStop(0, `rgba(${titleSettings.gradient1Red}, ${titleSettings.gradient1Green}, ${titleSettings.gradient1Blue}, ${titleSettings.gradient1Alpha})`)
    gradient.addColorStop(1, `rgba(${titleSettings.gradient2Red}, ${titleSettings.gradient2Green}, ${titleSettings.gradient2Blue}, ${titleSettings.gradient2Alpha})`)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, game.width, game.height)
}

// Draw title text
function drawTitle() {
    ctx.font = titleSettings.textFont
    ctx.textAlign = 'center'
    ctx.fillStyle = titleSettings.textColor
    ctx.fillText(titleSettings.titleString, titleSettings.textX, titleSettings.textY + 5)
    ctx.fillStyle = titleSettings.textUndercolor
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

function playerDead() {
    setInterval(gameOverLoop, 30)
}

function gameOverLoop() {
    
        frame++
        //Clear board
        ctx.clearRect(0, 0, game.width, game.height)
    
        drawGradient()
    
        for (var i in particles) {
          particles[i].draw();
        }
    
//    if (!gameOver.backgroundFinished) {
//        ctx.globalAlpha += .1
//        ctx.fillRect(0, 0, game.width, game.height)
//        console.log(ctx.globalAlpha)
//        //drawFillText('Game Over', game.width/2, game.height/2, 'white', 'Londrina Solid', '30', 'center')
//        
//        if (ctx.globalAlpha >= .5) {
//            ctx.globalAlpha = 0
//            gameOver.backgroundFinished = true
//        }
//    }
//    
//    if(gameOver.backgroundFinished) {
//        ctx.clearRect(0, 0, game.width, game.height)
//        ctx.fillStyle = 'black'
//        ctx.fillRect(0, 0, game.width, game.height)
//    }
//    
//    
//    
//    drawCircle()
//    
//    if (gameOver.backgroundFinished && !gameOver.bigTextFinished) {
//        ctx.globalAlpha = gameOver.bigtextopacity
//        drawFillText('Game Over', game.width/2, gameOver.bigTextY, 'white', 'Londrina Solid', '80', 'center')
//        gameOver.bigtextopacity += .2
//        gameOver.bigTextY -= 20
//        ctx.globalAlpha = 1
//        
//        if (gameOver.bigtextopacity >= .9 && gameOver.bigTextY <= gameOver.bigTextCeiling) {
//            drawFillText('Game Over', game.width/2, gameOver.bigTextY, 'white', 'Londrina Solid', '80', 'center')
//            gameOver.bigTextFinished = true
//        }
//    }
//    
//    if(gameOver.bigTextFinished) {
//        drawFillText('Game Over', game.width/2, gameOver.bigTextY, 'white', 'Londrina Solid', '80', 'center')
//    }
//    
//    ctx.fillStyle = 'hotpink'
//    ctx.fillRect(game.width/2-60, gameOver.bigTextY + 20, 120, 50)
//    drawFillText('Restart?', game.width/2, gameOver.bigTextY+ 50, 'white', 'serif', '20', 'center')
    
    drawCircle()
    
    drawTitle()
    
    drawStartText()
    
    emitParticles(randomRange(0, game.width), randomRange(0, game.height), 'white', 'white', 2, 20)
    
    if (frame === 750) {
        frame = 0
    }
}

playerDead()