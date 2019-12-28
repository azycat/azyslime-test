// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
// bgReady is used to let us know when it's safe to draw the image, 
// as trying to draw it before it's loaded will throw a DOM error.

var bgReady = false; 
var bgImage = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function() {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// Slime image
var slimeReady = false;
var slimeImage = new Image();
slimeImage.onload = function(){
	slimeReady = true;
};
slimeImage.src = "images/slime.png";

// Game objects
var hero = {
	speed: 256, // movement in pixels per second
	x: 0,
	y: 0
};
var slime = {
	x: 0,
	y: 0
};
var slimesCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a slime
// called to begin a new game or level or w/e
// hero in the center of the screen, slime somewhere random
var reset = function () {
	var threshold = 32; // min distance to be touching
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the slime somewhere on the screen randomly
	slime.x = threshold + ( Math.random() * (canvas.width - 64) );
	slime.y = threshold + ( Math.random() * (canvas.height - 64) );
};

window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

// upd8 game objects
var update = function (modifier) {
	var threshold = 32; // min distance to be touching
	if ( 38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
	}
	if ( 40 in keysDown ) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if ( 37 in keysDown ) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if ( 39 in keysDown ) { // Player holding right
		hero.x += hero.speed * modifier;
	}

	// are they touching?
	if(
		hero.x <= (slime.x + threshold)
		&& slime.x <= (hero.x + threshold)
		&& hero.y <= (slime.y + threshold)
		&& slime.y < (hero.y + threshold)
	){
		++slimesCaught;
	reset();
	}
};

// draw stuff
var render = function(){
	if(bgReady){
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady){
		ctx.drawImage(heroImage, hero.x, hero.y);
	}
	if (slimeReady){
		ctx.drawImage(slimeImage, slime.x, slime.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "20px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Azycat has been slimed " + slimesCaught + " times!", 12, 20);	
};

// the main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;


// game time
var then = Date.now();
reset();
main();