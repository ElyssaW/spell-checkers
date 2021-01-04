//================================================
//
//          Particle functions
//
//================================================

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