//================================================
//
//          Draw Functions
//
//================================================

// Draw sprite without float value
function drawSprite (obj, sprite) {
    ctx.drawImage(sprite, obj.x + obj.hitboxX, obj.y + obj.hitboxY)
}

// Draw the current word-to-type above the enemy's head
function drawName (obj, string1) {
    drawStrokeText(string1, obj.x+(obj.width/2), obj.y - 12, 'white', 'Bungee', 20, 'center')
    drawFillText(string1, obj.x+(obj.width/2), obj.y - 14, 'black', 'Bungee', 20, 'center')
}

// Small function to simulate floating on objects directly
function drawFloatAnim(obj) {
    obj.floatIndex++
    if (obj.floatIndex === obj.floatArray.length) {
        obj.floatIndex = 0
    }
    ctx.drawImage(obj.sprite, obj.x + obj.hitboxX, obj.y + obj.hitboxY + obj.floatArray[obj.floatIndex])
}

// This one's for ghosts only. Or any sprite that has separate animations on two different components of its body
function spriteCheck(obj) {
    if (obj.xdir < 0) {
        obj.face = obj.faceLeft
        obj.sprite = obj.spriteLeft
    } else if (obj.xdir > 0) {
        obj.face = obj.faceRight
        obj.sprite = obj.spriteRight
    }
}

// Function to draw health for the player
function drawHealth() {
    ctx.lineWidth = 1
    // Draw empty health circles
    for (let i = hero.maxhealth; i > 0; i--) {
        circle(20+(30*i), 50, 30, 'white', 'black', 0, 2 * Math.PI, [5, 5])
    }
    // Fill health circles
    for (let i = hero.health; i > 0; i--) {
        circle(20+(30*i), 50, 30, 'hotpink', 'black', 0 - frame, 2 * Math.PI + frame, [5, 5])
    }
}

// Write typo text for doors/chests. This functions breaks a sentence
// up into three strings, so that the typo part can be highlighted in red
function drawTypo (obj, string1, string2, string3) {
    
    // Creates an array of numbers to modify y position with, to simulate floating
    let floatValueArray = [0, 0, -1, -1, -2, -2, -3, -4, -5, -5, -4, -3, -2, -2, -1, -1]
    
    // Passes the current index value to the modifier variable
    let floatValue = floatValueArray[obj.textFrameIndex]
    
    // Set font/size
    ctx.font = '20px Fredoka One'
    
    // Get total width of the text, so that the text can be centered above the object generating it
    let textLength = ctx.measureText(string1).width + ctx.measureText(string2).width + ctx.measureText(string3).width
    
    // Find the center of the total width
    let textCenter = (obj.x+(obj.width/2)) - (textLength/2)
    
    // Draw first half of the sentence
    drawStrokeText(string1, textCenter, obj.y - 3 + floatValue, 'white', 'Fredoka One', 20, 'left')
    drawFillText(string1, textCenter, obj.y - 5 + floatValue, 'grey', 'Fredoka One', 20, 'left')
    
    // Draw typo in the sentence
    drawStrokeText(string2, textCenter + ctx.measureText(string1).width, obj.y - 3 + floatValue, 'white', 'Fredoka One', 20, 'left')
    drawFillText(string2, textCenter + ctx.measureText(string1).width, obj.y - 5 + floatValue, 'hotpink', 'Fredoka One', 20, 'left')
    
    // Draw second half of the sentence
    drawStrokeText(string3, textCenter + ctx.measureText(string1).width + ctx.measureText(string2).width, obj.y - 5 + floatValue, 'white', 'Fredoka One', 20, 'left')
    drawFillText(string3, textCenter + ctx.measureText(string1).width + ctx.measureText(string2).width, obj.y - 5 + floatValue, 'grey', 'Fredoka One', 20, 'left')
    
    // Increment float array index, so as to move the text into the next position when it is drawn
    obj.textFrameIndex++
    
    // Reset the index if it has reached the end of the array
    if (obj.textFrameIndex ===  floatValueArray.length) {obj.textFrameIndex = 0}
}