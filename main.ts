// Define custom sprite kinds for chaotic logic
namespace SpriteKind {
    export const ChaosTarget = SpriteKind.create()
}

// Global state variables
let playerSprite: Sprite = null
let targetSprite: Sprite = null
let gravityX = 0
let gravityY = 0
let currentRule = 0

// Initialize the game environment
effects.starField.startScreenEffect()
game.splash("CHAOS CATCHER", "A completely random game!")

// 1. Create the Player and Target
playerSprite = sprites.create(img`
    . . . . . . . . . . . . . . . . 
    . . . . . 4 4 4 4 4 . . . . . . 
    . . . . 4 5 5 5 5 5 4 . . . . . 
    . . . 4 5 4 4 5 4 4 5 4 . . . . 
    . . . 4 5 4 5 5 5 4 5 4 . . . . 
    . . . 4 5 5 5 5 5 5 5 4 . . . . 
    . . . . 4 5 4 4 4 5 4 . . . . . 
    . . . . . 4 4 4 4 4 . . . . . . 
    . . . . . . . 4 . . . . . . . . 
    . . . . 4 4 4 4 4 4 4 . . . . . 
    . . . . . . . 4 . . . . . . . . 
    . . . . . . 4 . 4 . . . . . . . 
    . . . . . 4 . . . 4 . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
    . . . . . . . . . . . . . . . . 
`, SpriteKind.Player)

targetSprite = sprites.create(img`
    . . . . . . . . . . . . . . . . 
    . . . . . . . a a . . . . . . . 
    . . . . . . a a a a . . . . . . 
    . . . . . a a 5 5 a a . . . . . 
    . . . . a a 5 5 5 5 a a . . . . 
    . . . . a 5 5 5 5 5 5 a . . . . 
    . . . a a 5 5 5 5 5 5 a a . . . 
    . . . a 5 5 5 5 5 5 5 5 a . . . 
    . . . a 5 5 5 5 5 5 5 5 a . . . 
    . . . a a 5 5 5 5 5 5 a a . . . 
    . . . . a 5 5 5 5 5 5 a . . . . 
    . . . . a a 5 5 5 5 a a . . . . 
    . . . . . a a 5 5 a a . . . . . 
    . . . . . . a a a a . . . . . . 
    . . . . . . . a a . . . . . . . 
    . . . . . . . . . . . . . . . . 
`, SpriteKind.ChaosTarget)

// Prevent sprites from flying outside the tiny screen boundaries
playerSprite.setStayInScreen(true)
targetSprite.setStayInScreen(true)

// Relocate target to a baseline random location
targetSprite.setPosition(randint(10, 150), randint(10, 110))

// 2. Continuous Physics Update Loop
game.onUpdate(function () {
    // Apply floating, unpredictable drift forces to player mechanics
    playerSprite.vx += gravityX
    playerSprite.vy += gravityY

    // De-accelerate slightly over time to keep it playable
    playerSprite.vx *= 0.9
    playerSprite.vy *= 0.9
})

// 3. The Core Randomizer Loop (Fires every 1500 milliseconds)
game.onUpdateInterval(1500, function () {
    // Generate a random rule paradigm [0 to 2]
    currentRule = randint(0, 2)

    // Radically disrupt physics metrics
    gravityX = randint(-15, 15)
    gravityY = randint(-15, 15)

    // Trigger visual chaos updates based on the rule selected
    if (currentRule == 0) {
        game.showLongText("Rule Shift: Zero Gravity! Speed Boost!", DialogLayout.Bottom)
        controller.moveSprite(playerSprite, 180, 180)
        playerSprite.scale = 1.5
    } else if (currentRule == 1) {
        game.showLongText("Rule Shift: Reverse Controls!", DialogLayout.Bottom)
        // Reverse vector inputs
        controller.moveSprite(playerSprite, -100, -100)
        playerSprite.scale = 0.6
    } else {
        game.showLongText("Rule Shift: Extreme Drifting!", DialogLayout.Bottom)
        controller.moveSprite(playerSprite, 50, 50)
        playerSprite.scale = 1.0
    }

    // Teleport target randomly to keep things moving
    targetSprite.setPosition(randint(10, 150), randint(10, 110))
    targetSprite.startEffect(effects.warmRadial, 500)
})

// 4. Overlap/Collision Logic
sprites.onOverlap(SpriteKind.Player, SpriteKind.ChaosTarget, function (sprite, otherSprite) {
    // The point payout system depends entirely on what chaos engine is active
    if (currentRule == 0) {
        info.changeScoreBy(5)
        music.play(music.melodyPlayable(music.powerUp), music.PlaybackMode.InBackground)
    } else if (currentRule == 1) {
        info.changeScoreBy(-2) // Punishing rule condition!
        music.play(music.melodyPlayable(music.pewPew), music.PlaybackMode.InBackground)
    } else {
        info.changeScoreBy(10)
        music.play(music.melodyPlayable(music.baDing), music.PlaybackMode.InBackground)
    }

    // Relocate target instantly after a catch
    otherSprite.setPosition(randint(10, 150), randint(10, 110))
})

