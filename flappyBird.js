let board = document.getElementById("board");
context = board.getContext("2d");
let boardHeight = 640;
let boardWidth = 360;

let birdImg= new Image();
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let bird={
    img: birdImg,
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

let xVelocity = 2;
let yVelocity = 0;
let gravity = -0.4;

let pipeWidth =64;
let pipeHeight = 512;
let pipeX=boardWidth;
let pipeY = 0;
let pipeOpening = 140;
let pipeUpImg;
let pipeDownImg;

let pipes=[];

let points=0;
let passedPipe=false;
let gameOver=false;
let gameStart = false;
let highScore=0;

let winSound = new Audio("flappyBirdWin.wav");
let loseSound = new Audio("flappyBirdLose.wav");
let flapSound = new Audio("flappyBirdFlap.wav");

window.onload = function startUp(){
    document.addEventListener("keydown", moveBird);
    document.addEventListener("keydown", resetGame);
    document.addEventListener("mousedown", moveBird);
    document.addEventListener("mousedown", resetGame);
    board.height = boardHeight;
    board.width = boardWidth;

    context.font="20px INK FREE";
    context.fillStyle="green";
    context.fillRect(25,35,130,50);
    context.fillRect(225,45,120,35);
    context.fillStyle="white";
    context.fillText('High Score: ' +String(highScore),230,70);
    context.font="30px Gothic";
    context.fillText("Points: "+String(points),30,70);
    
    birdImg.src = "flappybird.png";
    birdImg.onload = function(){
        context.drawImage(birdImg,birdX,birdY,birdWidth,birdHeight);
    }
    
    pipeUpImg = new Image();
    pipeUpImg.src="toppipe.png";
    pipeDownImg = new Image();
    pipeDownImg.src = "bottompipe.png";

    requestAnimationFrame(frame);
    const timer = setInterval(generatePipes,1500);
}


function frame(){
    requestAnimationFrame(frame);
    
    
    context.clearRect(0,0,board.width,board.height);
    
    if(gameStart){
        yVelocity += gravity;
        bird.y = Math.max(bird.y - yVelocity,30);
    }
    context.drawImage(birdImg,bird.x,bird.y,birdWidth,birdHeight);
    
    for(let i =0; i<pipes.length; i++){
        pipes[i].x-=xVelocity;
        context.drawImage(pipes[i].img,pipes[i].x,pipes[i].y,pipes[i].width,pipes[i].height);
        
        if(intersects(bird,pipes[i])||bird.y>boardHeight){
            xVelocity=0;
            context.font="40px";
            context.fillText("GAME OVER",30,120);

            if(bird.x+birdWidth>pipes[i].x+2 && bird.x<pipes[i].x+pipeWidth){
                if(bird.y+bird.height>pipes[i].y && pipes[i].y>0){
                    gravity=0;
                    bird.y=pipes[i].y-bird.height;
                }
            }
            if(gameOver===false){
                playSound(loseSound);
                gameOver=true;
            }
            
            if(points>highScore){
                highScore=points;
            }
        }
        if(!pipes[i].passed&&pipes[i].x+pipeWidth<bird.x){
            points+=0.5;
            pipes[i].passed=true;
            playSound(winSound);
        }
        if(bird.x+birdWidth>pipes[i].x+2 && bird.x<pipes[i].x+pipeWidth){
            if(bird.y+bird.height>pipes[i].y && pipes[i].y>0){
                bird.y=pipes[i].y-bird.height;
                gravity=0;
            }
        }
        
    }

    if(pipes[0].x<-pipeWidth && pipes.length>0){
        pipes.shift();
    }

    context.font="20px INK FREE";
    context.fillStyle="green";
    context.fillRect(25,35,130,50);
    context.fillRect(225,45,130,35);
    context.fillStyle="white";
    context.fillText('High Score: ' +String(highScore),230,70);
    context.font="30px Gothic";
    context.fillText("Points: "+String(points),30,70);
    
    
    
}

function moveBird(event){
    if(gameStart===false){
        gameStart=true;
    }
        yVelocity=6;
        playSound(flapSound);
    
}

function generatePipes(){
    let randomPipeY = Math.floor(Math.random()*4+1);

    switch(randomPipeY){
        case 1:
            randomPipeY = -pipeHeight*(1/4);
        break;
        case 2:
            randomPipeY = -pipeHeight*(2/4);
        break;
        case 3:
            randomPipeY = -pipeHeight*(2/5);
        break;
        case 4:
            randomPipeY = -pipeHeight*(3/5);
        break;
    }
     
    let topPipe = {
        img: pipeUpImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    } 

    pipes.push(topPipe);

    let bottomPipe = {
        img: pipeDownImg,
        x: pipeX,
        y: randomPipeY+pipeHeight+pipeOpening,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    } 

    pipes.push(bottomPipe);
}

function intersects(a,b){
    return a.x+a.width > b.x && a.x< b.x+b.width &&
       a.y+a.height>b.y && a.y<b.y+b.height;    
}

function resetGame(){
    if(gameOver===true){
        bird.y=birdY;
        xVelocity=2;
        pipes=[];
        points=0;
        gravity=-0.4;
        gameOver=false;
        gameStart=false;
    }
}

function playSound(audio){
    audio.play();
}