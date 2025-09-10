// Variables
var gamePattern = []; // This is a list where we remember the order of colors the computer picks.
var buttonColours = ["red", "blue", "green", "yellow"]; // These are the colors we can choose from.
var userClickedPattern = [];    // This is a list where we remember the order of colors the user clicks.
var level = 0; // This variable keeps track of what level you’re on (how many colors you have to remember).
var started = false; // This variable checks if the game has started or not.

// Detecting keyboard press
// When you press any key on your keyboard, the game checks if you’re at level 0 (just starting).  
// If you are, it starts the game and shows the first color.
$(document).keydown(function(){
    $("#level-title").text("Level " + level); // Update level display
    if (level === 0) {
        nextSequence(); // Start the game only if level is 0
        started = true;
    }
});

// Generates next sequence
// This picks a random color, adds it to the computer’s list, goes up one level,  
// shows the level number, flashes the color, plays its sound, and makes the button look pressed.
function nextSequence(){    
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);
    level++; // Increment level here
    $("#level-title").text("Level " + level); // Update level display
    flashElement("#" + randomChosenColour);
    playAudio(randomChosenColour);
    animatePress(randomChosenColour);
}

// Plays audio based on the color the user or computer clicked
function playAudio(color){
    var audio = new Audio('./sounds/' + color + '.mp3');
    audio.play();
}

// Animates flash effect
// This makes the color button quickly flash so you know which one to press.
function flashElement(selector) {
  $(selector).fadeIn(100).fadeOut(100).fadeIn(100);
};

// Animates button press
// This makes the button look pressed for a short time, then go back to normal.
function animatePress(color) {
    $("#" + color).addClass("pressed");
    setTimeout(function() {
        $("#" + color).removeClass("pressed");
    }, 100);
};

// Checks the user's answer
//This checks if you clicked the right color.  
// If you did, and finished the whole sequence, it gives you a new color after a second.  
// If you made a mistake, it plays a "wrong" sound, shows "Game Over", and resets the game.
function checkAnswer(currentLevel){
    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]){
        if (userClickedPattern.length === gamePattern.length){
            setTimeout(function(){
                nextSequence();
            }, 1000);
            userClickedPattern = [];
        }
    } else {
        var wrongAudio = new Audio('./sounds/wrong.mp3');
        wrongAudio.play();
        $("body").addClass("game-over");
        setTimeout(function(){
            $("body").removeClass("game-over");
        }, 200);
        $("#level-title").text("Game Over, Press Any Key to Restart");
        startOver();
    }
}

// Resets the game
// This puts everything back to the beginning so you can try again.
function startOver(){
    level = 0;
    gamePattern = [];
    userClickedPattern = [];
    started = false;
}

// Detecting button click
// When you click a color button, it remembers which color you clicked,  
// plays its sound, makes it look pressed, and checks if you got the sequence right.
$(".btn").click(function(){
    var userChosenColour = $(this).attr("id");
    userClickedPattern.push(userChosenColour);
    playAudio(userChosenColour);
    animatePress(userChosenColour);
    checkAnswer(userClickedPattern.length - 1);
});