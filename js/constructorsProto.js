//================================================
//
//          Constructor Functions
//
//================================================



// Constructor function for new rooms
function RoomConstructor(index) {
    // Set new room's index to current index
    this.index = index
    // Get enemy count
    this.enemyCount = 0
    // Generate new enemies for the room
    this.contents = generateRoomContent(this)
}

// Function to randomly generate new content for each room
function generateRoomContent(room) {
    // Initialize array to contain enemies
    let array = []
    // Initialize random value
    let random
    // Value to check whether the array already has a Period, for game balance reasons
    let includesPeriod = false
    
    // Each room must contain a door and a chest, so they're generated here
    let door = new DoorConstructor(570, 50)
    let chest = new ChestConstructor(280, 320)
    console.log(new Period(randomRange(100, game.width-100), randomRange(100, game.height-300)))
    array.push(new Period(randomRange(100, game.width-100), randomRange(100, game.height-300)))
    
    // End the function pre-emptively if the player is still in the tutorial rooms
    if (roomIndex <= 2) {
        
        if(roomIndex === 2) {
            array.push(door)
            array.push(chest)
            randomItem = new TutorialConstructor(randomRange(100, game.width-100), randomRange(100, game.height-300))
            array.push(randomItem)
            return array
            
        } else if (roomIndex === 1) {
            array.push(door)
            return array
            
        } else if (roomIndex === 0) {
            array.push(door)
            return array
        }
    }
    
    // Otherwise, continue as normal, randomly generating content and pushing it to the room array
    // Every room should contain a door and a chest, so those are always generated
    array.push(door)
    array.push(chest)
    
    // Iterate through a loop three times, picking a random option each time to populate into the room
    for (let i = 0; i < 3; i++) {
        
        // Set random number
        random = Math.floor(Math.random() * 5)
        
        switch(random) {
            case 1:
                // Add in exclaimer if random num is 1
                array.push(new ExclaimerConstructor(randomRange(100, game.width-100), randomRange(100, game.height-300)))
                break;
                
            case 2:
                // Add in ghost if random num is 2
                array.push(new Comma(randomRange(100, game.width-100), randomRange(100, game.height-300)))
                room.enemyCount++
                break;
                
            case 3:
                // Checks which room the player is currently on, and populates in harder enemies if they're further along
                if (roomIndex > 10) {
                    array.push(new Period(randomRange(100, game.width-100), randomRange(100, game.height-300)))
                } else {
                    array.push(new Comma(randomRange(100, game.width-100), randomRange(100, game.height-300)))
                }
                room.enemyCount++
                break;
                
            case 4: 
                // Add in period if random num is 4 and the room doesn't already include a period (Or if the room DOES include a
                // a period, but the player is further along)
                if ((!includesPeriod && roomIndex > 6) || roomIndex > 12) {
                    array.push(new Period(randomRange(100, game.width-100), randomRange(100, game.height-300)))
                    includesPeriod = true
                    room.enemyCount++
                } 
                break;
        }
    }
    // Return array of enemies/objects
    return array
}
