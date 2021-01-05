//================================================
//
//          Input Functions
//
//================================================

// Initialize movement object to allow continuous/diagonal movement
let moveObject = {up: false,
                  down: false,
                  left: false,
                  right: false,
                  topleft: false,
                  topright: false,
                  bottomleft: false,
                  bottomright: false
                 }

// Checks which direction the player is trying to move in, and moves them there. The player's movement is handled indirectly
// by setting booleans on an object, instead of by directly moving their x/y, because it allows the player to keep moving
// even when their key input is interrupt by a typing event: if keyup/keydown effected their movement directly, they would
// stutter briefly every time they type on the keyboard, since that input gets overridden by keypress
function movementHandler () {
    
    if (moveObject.down === true || moveObject.bottomleft === true || moveObject.bottomright === true) {
             hero.y += 5
             hero.ydir = 1
    } else if (moveObject.up === true || moveObject.topleft === true || moveObject.topright === true) {
             hero.y -= 5
             hero.ydir = -1
    } else {
             hero.ydir = 0
    }
    
    if (moveObject.right === true || moveObject.topright === true || moveObject.bottomright === true) {
             hero.sprite = document.getElementById("madge")
             hero.x += 5
             hero.xdir = 1
             console.log(hero.xdir)
    } else if (moveObject.left === true || moveObject.topleft === true || moveObject.bottomleft === true) {
             hero.sprite = document.getElementById("madgeFlipped")
             hero.x -= 5
             hero.xdir = -1
    } else {
             hero.xdir = 0
    }
}

// This duo of functions essentially replicates the keypress events for the arrow keys.
// The typical keypress event gets interrupted by typing - meaning, the hero will stop
// moving when the player types, until the player moves them again. This tracks the numpad
// by keydown/keyup instead, so that the computer will continue accepting movement input even
// while the keyboard is being used for typing. 
document.addEventListener('keydown', e => {
    
    // Check if player is backspacing on current text
    if (e.keyCode === 8) {
        playerText.pop()
    
    // Check if player is pressing space bar to dash
    } else if (e.keyCode === 32) {
        // Create trail between starting position and end position
        for (let i = 0; i < 10; i++) {
                ctx.drawImage(hero.sprite, hero.x + hero.hitboxX + (20 * i * hero.xdir), hero.y + hero.hitboxY + (20 * i * hero.ydir))
            }  
        // Move player
        hero.x = hero.x + (hero.xdir * 200)
        hero.y = hero.y + (hero.ydir * 200)
        
    } else {
        // If it is a numpad press, interact with move object accordingly
        switch (e.key) {
            case '1':
                moveObject.bottomleft = true
                break;
                
            case '2':
                moveObject.down = true
                break;
                
            case '3':
                moveObject.bottomright = true
                break;
                
            case '4':
                moveObject.left = true
                break;
                
            case '6':
                moveObject.right = true
                break;
                
            case '7':
                moveObject.topleft = true
                break;
                
            case '8':
                moveObject.up = true
                break;
                
            case '9':
                moveObject.topright = true
                break;
            }
    }
 })

// Listen for key up, to stop moving the player
 document.addEventListener('keyup', e => {
     // If it is a numpad press, interact with move object accordingly
        switch (e.key) {
            case '1':
                moveObject.bottomleft = false
                break;
                
            case '2':
                moveObject.down = false
                break;
                
            case '3':
                moveObject.bottomright = false
                break;
                
            case '4':
                moveObject.left = false
                break;
                
            case '6':
                moveObject.right = false
                break;
                
            case '7':
                moveObject.topleft = false
                break;
                
            case '8':
                moveObject.up = false
                break;
                
            case '9':
                moveObject.topright = false
                break;
            }
 })

// Function to check player input when Enter is pressed
function submissionEvent() {
    // Grab player input from box
    playerInput = playerText.join('')
    
    // Reset player text array
    playerText = []
}

// Listen for letter or submission input from player.
document.addEventListener('keypress', e => {
    // Check if input is instead for typing on the keyboard
    if (e.charCode >= 65 && e.charCode <= 122) {
        playerText.push(e.key)
    } else if (e.keyCode === 13) {
        submissionEvent()
    } else if (e.keyCode === 8) {
        playerText.pop()
    }
})