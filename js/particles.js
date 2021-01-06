//================================================
//
//          Particle functions
//
//================================================

// Letter array, for particle generation
let letterArray = ['a', 'b', 'c', 'd', 'e', 'g',
                    'h', 'i', 'j', 'k', 'l', 'm',
                   'n', 'o', 'p', 'q', 'r', 's',
                   't', 'u', 'v', 'w', 'x', 'y', 'z'
                  ]
// Create object array to hold the particles, because I'm a child entertained by pretty lights
let particles = {}
// Create current index to keep track of how many particles currently exist, and assign IDs to new ones
let particleIndex = 0
// Particle settings, to easily alter particle behavior/appearence
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

// constructor function for new Particles
function Particle() {
        this.x = particleSettings.startingX
        this.y = particleSettings.startingY
        // Sets a different "ground Y" randomly for each particle, to simulate falling across a flat plane
        this.groundLevel = this.y + randomRange(-100, 300)
        // Various settings, grabbed from the settings object
        this.color = particleSettings.color
        this.undercolor = particleSettings.undercolor
        this.font = particleSettings.font
        this.fontSize = particleSettings.fontSize
        this.vx = randomRange(-5, 5)
        this.vy = randomRange(-5, -10)
        this.letter = selectRandom(letterArray)
        
        // Increment particle index and push particle to object-array
        particleIndex++
        particles[particleIndex] = this
        this.id = particleIndex
        this.life = 0
        this.maxLife = particleSettings.maxLife
        this.opacity = 1
    
        // Draw function
        this.draw = function() {
            // Change x, y, vx, and vy
            this.x += this.vx
            this.y += this.vy
            // Age the particle
            this.life++

            // Bounce on ground
            if (this.y + particleSettings.particleSize > this.groundLevel) {
                this.vy *= -0.6
                this.vx *= 0.75
                this.y = this.groundLevel - particleSettings.particleSize
            }

            // Alter vy based on gravity
            this.vy += particleSettings.gravity

            // Decrement opacity
            if (this.opacity > .02) {
                this.opacity -= .02
            }

            // Draw particle
            ctx.globalAlpha = this.opacity
            ctx.font = '20px serif'
            ctx.fillStyle = this.undercolor
            ctx.fillText(this.letter, this.x, this.y+3)
            ctx.fillStyle = this.color
            ctx.fillText(this.letter, this.x, this.y)
            ctx.globalAlpha = 1

            // Delete if particle is old and grody (And its life has reached the cap)
            if (this.life >= this.maxLife) {
                delete particles[this.id]
        }
    }
}

// function to slap particles down whenever and wherever I choose, in whatever colors I want
function emitParticles (x, y, color, undercolor, amount, size) {
    particleSettings.font = size + 'px'
    particleSettings.startingX = x
    particleSettings.startingY = y
    particleSettings.color = color
    particleSettings.undercolor = undercolor
    // Emit particles
    for (let i = 0; i < amount; i++) {
        new Particle()
    }
}