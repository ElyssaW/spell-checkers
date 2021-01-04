//===============================================
//
//              Basic functions
//
//===============================================

// Select random item from given array
function selectRandom (randomArray) {
    return randomArray[Math.floor(Math.random() * randomArray.length)]
}

// Select random number from given range
function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
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
    ctx.lineWidth = 1
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

// Write text above object
function drawText (string, obj) {
    ctx.fillStyle = 'red'
    ctx.fillText(string, obj.x, obj.y-5)
}

// If input matches expected string, return true
function compareString(input, compString) {
    if (input === compString) {
        return true
    } else {
    // If string input is not correct, deduct health
        return false
    }
}