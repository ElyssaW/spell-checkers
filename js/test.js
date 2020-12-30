console.log('Hello!')

// Initial variables
let ctx = game.getContext('2d')
// Game Loop Interval
let gameInterval

game.setAttribute('width', 1200)
game.setAttribute('height', 700)
// Checks if game is on
let gameStart = false

let letterArray = ['a', 'b', 'c', 'd', 'e', 'g',
                    'h', 'i', 'j', 'k', 'l', 'm',
                   'n', 'o', 'p', 'q', 'r', 's',
                   't', 'u', 'v', 'w', 'x', 'y', 'z'
                  ]

function selectRandom (randomArray) {
    return randomArray[Math.floor(Math.random() * randomArray.length)]
}

let posX = 20
let posY = game.height/2
let vx = 10
let vy = -10
let gravity = 1

// Set canvas width/height
// Set attribute and get computed style make the game more
// responsive, allowing for clicks and computer graphics to still
// display properly when set


let particles = {}
let particleIndex = 0
let settings = {
    density: 5,
    particleSize: 5,
    startingX: game.width/2,
    startingY: game.height/4,
    gravity: .5,
    maxLife: 150,
    groundLevel: game.height,
    leftwall: 0,
    rightwall: game.width
}

let seedsX = []
let seedsY = []
let maxAngles = 100
let currentAngle = 0

function seedAngles() {
    seedsX = []
    seedsY = []
    for (let i = 0; i < maxAngles; i++) {
        seedsX.push(Math.random() * 20 - 10)
        seedsY.push(Math.random() * 30 -10)
    }
}

seedAngles()

function Particle() {
    if (currentAngle !== maxAngles) {
        this.x = settings.startingX
        this.y = settings.startingY
        this.vx = seedsX[currentAngle]
        this.vy = seedsY[currentAngle]
        this.letter = selectRandom(letterArray)
        currentAngle++
        
        particleIndex++
        particles[particleIndex] = this
        this.id = particleIndex
        this.life = 0
        this.maxLife = settings.maxLife
        this.opacity = 1
    } else {
        seedAngles()
        currentAngle = 0
    }
}

Particle.prototype.draw = function() {
    this.x += this.vx
    this.y += this.vy
    this.life++
    
    if (this.y + settings.particleSize > settings.groundLevel) {
        this.vy *= -0.6
        this.vx *= 0.75
        this.y = settings.groundLevel - settings.particleSize
    }

    this.vy += settings.gravity
    this.life++
    this.opacity -= .02
    
    if (this.life >= this.maxLife) {
        delete particles[this.id]
    }
    
    ctx.font = '25px serif'
    ctx.fillStyle = 'rgba(255, 0, 0, '+this.opacity+')'
    ctx.fillText(this.letter, this.x, this.y)
//    ctx.fillText(this.letter, this.x, this.y)
}

document.addEventListener('click', (e) => {
    console.log(e.x)
    console.log(e.y)
    settings.startingX = e.x
    settings.startingY = e.y
})


// Where the magic happens
let gameLoop = () => {
    ctx.clearRect(0, 0, game.width, game.height)
    
    for (var i = 0; i < settings.density; i++) {
          if (Math.random() > 0.97) {
            // Introducing a random chance of creating a particle
            // corresponding to an chance of 1 per second,
            // per "density" value
            new Particle();
          }
        }

        for (var i in particles) {
          particles[i].draw();
        }
    
//    ctx.fillStyle = 'black'
//    ctx.fillRect(posX, posY, 10, 10)
//    
//    posX += vx
//    posY += vy
//    vy += gravity
//    
//    if (posY > 400) {
//        vy *= -0.6
//        vx *= .75
//        posY = 400
//    }
}

function gameBegin() {
    gameInterval = setInterval(gameLoop, 30)
}

gameBegin()