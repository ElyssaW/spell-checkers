function playerDead() {
    titleSettings.gradient1Red = 0
    titleSettings.gradient1Green = 0
    titleSettings.gradient1Blue = 0
    titleSettings.gradient1Alpha = 1
    titleSettings.gradient2Red = 0
    titleSettings.gradient2Green = 0
    titleSettings.gradient2Blue = 0
    titleSettings.gradient2Alpha = 0
    titleSettings.textColor = 'black'
    titleSettings.textUndercolor = 'white'
    titleSettings.textFont = '80px Londrina Solid'
    titleSettings.titleString = 'GAME OVER'
    titleSettings.circleFill = 'black'
    titleSettings.circleStroke = 'white'
    titleSettings.startString = '- Restart? -'
    titleSettings.startColor = 'hotpink'
    
    setInterval(gameOverLoop, 30)
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