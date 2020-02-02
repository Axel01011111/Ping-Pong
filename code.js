var canvas;
var canvasContext;

var winner = false;

//ball numbers
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 5;

//Scores
var player1Score = 0;
var player2Score = 0;
const WINNER_SCORE = 3;

//paddle numbers
var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const paddleThick = 10;

function calculateMousePos(evt){
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return {
		x:mouseX,
		y:mouseY
	};
}

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	
	
	var frameRate = 30;
	setInterval(function(){
		drawEverything();
		moveEverything();		
	}, 1000/frameRate);

	canvas.addEventListener('mousedown', function(){		
		if(winner){
			player1Score = 0;
			player2Score = 0;
			winner = false;
		}
	});
	
	canvas.addEventListener('mousemove', function(evt){
		var mousePos = calculateMousePos(evt);
		paddle1Y = mousePos.y - (PADDLE_HEIGHT / 2);
	});
}

function ballReset(){
	if(player1Score >= WINNER_SCORE || player2Score >= WINNER_SCORE){
		winner = true;
	}

	ballX = canvas.width/2;
	ballY = canvas.height/2;
	ballSpeedX = -(ballSpeedX);
}

function opponentMove(){
	var paddlePosition = paddle2Y + (PADDLE_HEIGHT/2);

	if(paddlePosition < ballY -35){
		paddle2Y += 7;
	}
	else if(paddlePosition > ballY - 35){
		paddle2Y -= 7;
	}
}

function moveEverything(){
	if(winner){
		return;
	}	


	ballX += ballSpeedX;
	ballY += ballSpeedY;


	opponentMove();

	if(ballX < 10){
		if(ballY > paddle1Y && 
		ballY < paddle1Y + PADDLE_HEIGHT){
			ballSpeedX = -ballSpeedX;

			var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.35;
		}else{
			player2Score++; //Must be on top
			ballReset();
			
			
		}
	}
	if(ballX > canvas.width - paddleThick){
		if(ballY > paddle2Y && 
		ballY < paddle2Y + PADDLE_HEIGHT){
			ballSpeedX = -ballSpeedX;

			var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.35;
		}else{
			player1Score++; //Must be on top
			ballReset();
			
		}
	}
	if(ballY < 10){
		ballSpeedY = -ballSpeedY;
	}
	if(ballY > canvas.height - paddleThick){
		ballSpeedY = -ballSpeedY;
	}
}

function drawNet(){
	for(var i=0;i<canvas.height;i+=25){
		drawColor(canvas.width/2, i+10, 2, 10, 'white');
	}
}


function drawEverything(){	
	//This draws the background
	drawColor(0, 0, canvas.width, canvas.height, 'black');

	if(winner){
		canvasContext.fillStyle = 'white';
		canvasContext.fillText("Click to continue", 370, 200);
		canvasContext.fillText("Your Score: "+player1Score, 30, 400);
		canvasContext.fillText("AI Score: "+player2Score, 720, 400);
		return;
	}	


	//this draws the player 1
	drawColor(0, paddle1Y, paddleThick, PADDLE_HEIGHT, 'white');

	drawNet();

	//this draws the player 2
	drawColor(canvas.width - paddleThick, paddle2Y, paddleThick, PADDLE_HEIGHT, 'white');

	//this draws the ball
	createCircle(ballX, ballY, 10, 'white');

	canvasContext.fillText(player1Score, 100, 100);
	canvasContext.fillText(player2Score, canvas.width-100, 100);
}

function createCircle(centerX, centerY, radius, drawColor){
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
	canvasContext.fill();
}


function drawColor(leftX, topY, width, height, color){
	canvasContext.fillStyle = color;
	canvasContext.fillRect(leftX, topY, width, height);
}
