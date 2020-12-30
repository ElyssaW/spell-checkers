// Initial variables
let ctx = game.getContext('2d')
game.setAttribute('width', 1200)
game.setAttribute('height', 700)

// Letter array
let letterArray = ['a', 'b', 'c', 'd', 'e', 'g',
                    'h', 'i', 'j', 'k', 'l', 'm',
                   'n', 'o', 'p', 'q', 'r', 's',
                   't', 'u', 'v', 'w', 'x', 'y', 'z'
                  ]

//let letterArray = [{letter: 'a', x: 0, y: 0, opacity: 0}, {letter: 'b', x: 0, y: 0, opacity: 0},
//                   {letter: 'c', x: 0, y: 0, opacity: 0}, {letter: 'd', x: 0, y: 0, opacity: 0},
//                   {letter: 'e', x: 0, y: 0, opacity: 0}, {letter: 'f', x: 0, y: 0, opacity: 0},
//                   {letter: 'g', x: 0, y: 0, opacity: 0}, {letter: 'h', x: 0, y: 0, opacity: 0},
//                   {letter: 'i', x: 0, y: 0, opacity: 0}, {letter: 'j', x: 0, y: 0, opacity: 0},
//                   {letter: 'k', x: 0, y: 0, opacity: 0}, {letter: 'l', x: 0, y: 0, opacity: 0},
//                   {letter: 'm', x: 0, y: 0, opacity: 0}, {letter: 'n', x: 0, y: 0, opacity: 0},
//                   {letter: 'o', x: 0, y: 0, opacity: 0}, {letter: 'p', x: 0, y: 0, opacity: 0},
//                   {letter: 'q', x: 0, y: 0, opacity: 0}, {letter: 'r', x: 0, y: 0, opacity: 0},
//                   {letter: 's', x: 0, y: 0, opacity: 0}, {letter: 't', x: 0, y: 0, opacity: 0},
//                   {letter: 'u', x: 0, y: 0, opacity: 0}, {letter: 'v', x: 0, y: 0, opacity: 0},
//                   {letter: 'w', x: 0, y: 0, opacity: 0}, {letter: 'x', x: 0, y: 0, opacity: 0},
//                   {letter: 'y', x: 0, y: 0, opacity: 0}, {letter: 'z', x: 0, y: 0, opacity: 0}
//                  ]

let index = 0
let frame = 0
let circleFrame = 0
let circleIncrease = true
let gradient
let mouseover
let roomIndex = 0
let animText = {x: 560,
                y: 360,
                alpha: 0,
                animate: false,
                finished: false}

// Function to grab a random range
function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

// Function to listen for a mouseover on the title text
document.addEventListener('mousemove', (e) => {
    if (e.x > 560 && e.x < 870 && e.y > 200 && e.y < 518 && !animText.finished) {
            animText.animate = true
    } else {
            animText.animate = false
        
    }
})

document.addEventListener('click', (e) => {
    if (e.x > 560 && e.x < 870 && e.y > 200 && e.y < 518) {
            roomBase.active = true
    }
})

// Where the magic happens
let gameLoop = () => {
    
    frame++
    //Clear board
    ctx.clearRect(0, 0, game.width, game.height)
    
    ctx.font = '20px serif'
    ctx.fillStyle = 'lightgrey'
    for (let j = 0; j < game.width/10; j++) {
        for (let i = 0; i < letterArray.length; i++) {
            if (index % 2) {
                ctx.fillText(letterArray[i], (30*j), (30*i)+frame)
                ctx.fillText(letterArray[i], (30*j), (30*i)+frame-750)
            } else {
                ctx.fillText(letterArray[i], (30*j), (30*i)-frame)
                ctx.fillText(letterArray[i], (30*j), (30*i)-frame+750)
            }
        }
        index++
    }
    
    
    index = 0
    
    ctx.fillStyle = 'white'
    ctx.strokeStyle = 'black'
    ctx.beginPath()
    ctx.arc(562, 280, 150, 0, 2 * Math.PI)
    ctx.fill()
    
    ctx.strokeStyle = 'black'
    ctx.beginPath()
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.arc(562, 280, 150, 0 - frame, 2 * Math.PI + frame)
    ctx.closePath()
    ctx.stroke()
    
    if (circleFrame > 3) {
        circleIncrease = false
    } else if (circleFrame === 0) {
        circleIncrease = true
    }
    
    if (frame % 8 === 0) {
        if (circleIncrease) {
            circleFrame++
        } else {
            circleFrame--
        }
    }
    
    gradient = ctx.createRadialGradient(562,300,700,562,300,0)
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)")
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, game.width, game.height)
    
    ctx.font = '50px Londrina Solid'
    ctx.textAlign = 'center'
    ctx.fillStyle = 'white'
    ctx.fillText('SPELL CHECKERS', 562, 305+circleFrame)
    ctx.fillStyle = 'black'
    ctx.fillText('SPELL CHECKERS', 562, 300+circleFrame)
    
    if (!animText.finished && animText.animate) {
            animText.y--
            ctx.font = '30px serif'
            ctx.fillStyle = 'grey'
            ctx.fillText('- Start -', animText.x, animText.y)
            
            if (animText.y === 350) {
                console.log('Finished')
                animText.finished = true
            }
    } else if (animText.finished) {
            ctx.font = '30px serif'
            ctx.fillStyle = 'grey'
            ctx.fillText('- Start -', 560, 350) 
    }
    
    if (frame === 750) {
        frame = 0
    } 
}

function gameBegin() {
    
    gameInterval = setInterval(gameLoop, 17)
    gameStart = true
}

gameBegin()