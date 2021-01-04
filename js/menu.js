
//================================================
//
//          Victory Screen Function
//
//================================================

fieldSettings = {
    array: [],
    spacingX: 30,
    spacingY: 30,
    cursorRadius: 100,
    size: 20,
    speed: .2,
}

let mouseX
let mouseY
game.addEventListener('mousemove', (e)=> {
    mouseX = e.offsetX
    mouseY = e.offsetY
})

function calcDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x1-x2), 2) + Math.pow((y1 - y2), 2))
}

function gridParticle(x, y) {
    this.x = x,
    this.y = y,
    this.letter = selectRandom(letterArray)
    this.vx = 0,
    this.vy = 0,
    this.speed = fieldSettings.speed
    this.color = 'black'
    this.returnX = x,
    this.returnY = y
    this.floatArray = [-4, -3, -2, -2, -1, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
                       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                       0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1, -1, -2, -2, -2, -3, -3, -4]
    this.floatIndex = randomRange(0, this.floatArray.length)
    this.frame = 0
    this.render = function() {
        drawFillText(this.letter, this.x, this.y + this.floatArray[this.floatIndex], this.color, 'serif', fieldSettings.size, 'center')
        //circle(this.x, this.y, 10, this.color)
    }
    this.draw = function() {
        if (calcDistance(this.x, this.y, mouseX, mouseY) < fieldSettings.cursorRadius) {
            this.x = this.x + ((this.x - mouseX)) * this.speed
            this.y = this.y + ((this.y - mouseY)) * this.speed
        } else if ((this.x <= mouseX-fieldSettings.cursorRadius-fieldSettings.size || this.x >= mouseX+fieldSettings.cursorRadius+fieldSettings.size || this.y <= mouseY-fieldSettings.cursorRadius-fieldSettings.size || this.y >= mouseY+fieldSettings.cursorRadius+fieldSettings.size) &&
                   (this.x !== this.returnX || this.y !== this.returnY)) {
            this.x = this.x + ((this.returnX - this.x)*this.speed)
            this.y = this.y + ((this.returnY - this.y)*this.speed)
        } 
    
        if (this.floatIndex === this.floatArray.length-1) {
            this.floatIndex = 0
        } else {
            this.floatIndex++
        }
    }
}

for (let i = 0; i < (game.width/fieldSettings.spacingX); i++) {
    for (let j = 0; j < (game.height/fieldSettings.spacingY); j++) {
            let parti = new gridParticle(fieldSettings.spacingX*i, fieldSettings.spacingY*j)
            fieldSettings.array.push(parti)  
    }
}

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
    
    // Reset player
    hero.maxhealth = 3
    hero.health = hero.maxhealth
    
    // Start gameOver loop
    gameInterval = setInterval(gameOverLoop, 30)
}

function gameOverLoop() {
    
        frame++
        //Clear board
        ctx.clearRect(0, 0, game.width, game.height)
    
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, game.width, game.height)
    
        for (var i in particles) {
          particles[i].draw();
        }
    
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
//          Title functions/loop
//
//================================================

// Initialize gradient
let gradient
// Initialize mouseover
let mouseover
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

let leftHandMode = false

function addHover() {
    game.addEventListener('mousemove', (e) => {
        if(e.offsetX > 450 && e.offsetX < 750 && e.offsetY > 470 && e.offsetY < 510) {
            if (titleSettings.box1Height < 40) {
                titleSettings.box1Height++
                titleSettings.box1y -= .5
            } 
        } else if (titleSettings.box1Height > 30){
                titleSettings.box1Height--
                titleSettings.box1y += .5
        }
        
        if(e.offsetX > 450 && e.offsetX < 750 && e.offsetY > 510 && e.offsetY < 560) {
            if (titleSettings.box2Height < 40) {
                titleSettings.box2Height++
                titleSettings.box2y -= .5
            } 
        } else if (titleSettings.box2Height > 30){
                titleSettings.box2Height--
                titleSettings.box2y += .5
        }
        
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

function addClick() {
   // Start game if clicked
    game.addEventListener('click', (e) => {
        
        if (mouseInput) {
            if(e.offsetX > 450 && e.offsetX < 750 && e.offsetY > 470 && e.offsetY < 510) {
            console.log('clicked1')
            setGradient()
            roomIndex = -1
            mouseInput = false
            moveToNextRoom()
            
            }

            if(e.offsetX > 450 && e.offsetX < 750 && e.offsetY > 510 && e.offsetY < 560) {
                console.log('clicked2')
                setGradient()
                roomIndex = 3
                mouseInput = false
                moveToNextRoom()
            }

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

function setGradient() {
    titleSettings.gradient1Red = 255
    titleSettings.gradient1Green = 255
    titleSettings.gradient1Blue = 255
    titleSettings.gradient1Alpha = 0
    titleSettings.gradient2Red = 255
    titleSettings.gradient2Green = 255
    titleSettings.gradient2Blue = 255
}

// Draw the "Start game!" which flies up when the mouse hovers over the title area
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