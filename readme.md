### Read Me Test

Game Idea:

A dungeon crawler/typing test crossover. You play a Spell Checker mage trapped in an essay dungeon, consisting
of small (Canvas-sized, even) rooms chained together into a larger dungeon. Each room is locked with a "typo door,"
a door associated with a word (Like "razzmatazz," as an example). The player has to type the word correctly to unlock the door,
proceeding to the next room. If they incorrectly type the word three times, they lose. Typing is through keyboard, player movement
is through the arrow pad.

### Tech Stack

- [ ] HTML
- [ ] CSS
- [ ] Javascript
- [ ] Canvas

### Wireframe

![GitHub Logo](Untitled.png)

### MVP Goals

- [x] 3 room dungeon
- [x] Doors to type on and move between rooms
- [x] Form submission, to accept string input from player
- [x] Compare player input to correct input
- [x] 3-point Health bar (Detract from if player input is incorrect)

### Stretch Goals

- [x] Writing word-to-type directly on the canvas, instead of above
- [x] Enemies, whose names you have to type to defeat
- [x] Locked chests containing health
- [x] Space-to-shield, allowing you to use the space bar as a shield against attacks. UPDATE: A shield ability made the game a little too easy, and Shift in particular kept tripping up Sticky Keys. Revamped into "Space Bar to Dash" instead.
- [x] Custom graphics
- [ ] Super-stretch: Non-linear dungeon with rooms containing multiple entrances/exits
- [ ] Super-stretch: Enemy/door types that require special words found elsewhere in the dungeon

### Roadblocks

- [ ] Is it possible to elegantly accept input from inside and outside the canvas?
If not, is it possible to implement the typing mechanic in Canvas?
Will the game be fun and easy to play? Is it too tiresome to split play between typing and typical dungeon crawl?

- [ ] How to handle the dungeon. Would it be possible to hold all the rooms in an array of objects? Would a new room need to be generated each time? Is it possible to 
have retain memory of past rooms and keep a consistent layout between them?
