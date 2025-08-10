const canvas=document.getElementById('grid');
const menu=document.getElementById('menu');
const scoreDisplay=document.getElementById('score');
const playerStat=document.getElementById('player');
const landscapeStat=document.getElementById('background');
const playerImg=document.getElementById('playerImg');
const backgroundImg=document.getElementById('backgroundImg')
const context=canvas.getContext("2d");

const gridHeight=canvas.height;
const gridWidth=canvas.width;
let landscapeId=landscapeStat.value;
let birdId=playerStat.value;
let pipeUps=[];
let pipeDowns=[];
let pipeUp={};
let pipeDown={};
let birdYvelocity=-6;
let birdXvelocity=0;
const gravity=0.4;
const birdWidth=43;
const birdHeight=43;
const pipeVelocity=-2;
const pipeWidth=64;
const pipeHeight=246;
const gap=pipeHeight/2;
const bird={ Img: new Image(),
             x:30,
             y:gridHeight/2,};

let isGameOver=false;
let score=0;
let pipeCreatorTimer=null;
// load audio 
const wingSound=new Audio('sound-effects/sfx_wing.wav');
const hitSound=new Audio('sound-effects/sfx_hit.wav');
const pointSound=new Audio('sound-effects/sfx_point.wav');
const dieSound=new Audio('sound-effects/sfx_die.wav');
const dayMusic=new Audio('sound-effects/Piki - Kitty (freetouse.com).mp3');
const nightMusic=new Audio('sound-effects/Piki - Moonlight Tribal Carnival (freetouse.com).mp3');
const menuMusic=new Audio('sound-effects/Piki - Monogatari (freetouse.com).mp3');
const hello=new Audio();
const lose=new Audio();
menuMusic.volume=0.3;
menuMusic.loop=true;
dayMusic.loop=true;
nightMusic.loop=true;
//chose player
playerImg.classList.add(`player${playerStat.value}`);
playerStat.addEventListener('change',()=>{

        if(playerImg.classList.contains('player1')){
            playerImg.classList.remove('player1');
            playerImg.classList.add(`player${playerStat.value}`);
            hello.src=`sound-effects/char${playerStat.value}hello.ogg`;
            hello.currentTime=0;
            hello.play();
            
      }

        else if(playerImg.classList.contains('player2')){
            playerImg.classList.remove('player2');
            playerImg.classList.add(`player${playerStat.value}`);
            hello.src=`sound-effects/char${playerStat.value}hello.ogg`;
            hello.currentTime=0;
            hello.play();
      }

        else if(playerImg.classList.contains('player3')){
            playerImg.classList.remove('player3');
            playerImg.classList.add(`player${playerStat.value}`);
            hello.src=`sound-effects/char${playerStat.value}hello.ogg`;
            hello.currentTime=0;
            hello.play();
      }

        else{
            playerImg.classList.remove('player4');
            playerImg.classList.add(`player${playerStat.value}`);
            hello.src=`sound-effects/char${playerStat.value}hello.ogg`;
            hello.currentTime=0;
            hello.play();
      }

});
//chose background
backgroundImg.classList.add(`landscape${landscapeStat.value}`);
landscapeStat.addEventListener('change',()=>{

      if(backgroundImg.classList.contains('landscape1')){
           backgroundImg.classList.remove('landscape1');
           backgroundImg.classList.add(`landscape${landscapeStat.value}`);}
      
      else{backgroundImg.classList.remove('landscape2');
           backgroundImg.classList.add(`landscape${landscapeStat.value}`);}
            
})

//press on play buttom
function start(){
      dayMusic.volume=1;
      nightMusic.volume=1;
      menuMusic.pause();
      isGameOver=false;
      score=0;
      
      menu.classList.add('hidden');
      canvas.classList.remove('hidden'); 
       if(backgroundImg.classList.contains('landscape1')){
            canvas.classList.remove('landscape2');
            canvas.classList.add('landscape1');           
            nightMusic.pause();
            dayMusic.currentTime=0;
            dayMusic.play();}
      
      else{
            canvas.classList.remove('landscape1');
            canvas.classList.add('landscape2');
            dayMusic.pause();
            nightMusic.currentTime=0;
            nightMusic.play();
      }

      
      //add bird
       bird.Img.src=`Bird${playerStat.value}.png`;
       bird.Img.onload=()=>{
           context.drawImage(bird.Img,bird.x,bird.y, birdWidth,birdHeight);
      }


      document.addEventListener('keydown',moveBird);
      pipeCreatorTimer=setInterval(creatPipes,1500);
      requestAnimationFrame(animate);
      
      
}


function animate(){
        
        if(isGameOver){
              return;
          }
        requestAnimationFrame(animate);
        context.clearRect(0,0,gridWidth,gridHeight) 
        //draw bird
            birdYvelocity+=gravity;
            bird.y=Math.max(birdYvelocity+bird.y,0);
            context.drawImage(bird.Img,bird.x,bird.y, birdWidth,birdHeight)
           //draw pipe
        for(let i=0;i<pipeUps.length;i++){
            pipeUps[i].x+=pipeVelocity;
            pipeDowns[i].x+=pipeVelocity;
            context.drawImage(pipeUps[i].Img,pipeUps[i].x,pipeUps[i].y,pipeWidth,pipeHeight);
            context.drawImage(pipeDowns[i].Img,pipeDowns[i].x,pipeDowns[i].y,pipeWidth,pipeHeight);
            //check for points
            if(bird.x>pipeUps[i].x+pipeWidth&&!pipeUps[i].passed){ 
                   pointSound.currentTime=0;
                   pointSound.play()
                    score+=1;
                    pipeUps[i].passed=true
                    console.log(score)
            }
            //check for collision with...

            if(    //ground
               bird.y+birdHeight>=gridHeight||
                  //pipeUps
               bird.x+birdWidth-10>pipeUps[i].x &&
               bird.x<pipeUps[i].x+pipeWidth &&
               bird.y+ birdHeight>pipeUps[i].y &&
               bird.y<pipeUps[i].y+pipeHeight||
                //pipeDowns
               bird.y+birdWidth>pipeDowns[i].y &&
               bird.x+birdWidth-10>pipeDowns[i].x &&
               bird.x<pipeDowns[i].x+pipeWidth

            ){
              dayMusic.volume=0.5;
              nightMusic.volume=0.5;
              hitSound.currentTime=0;
              hitSound.play();
              isGameOver=true;
              lose.src=`sound-effects/char${playerStat.value}lose.ogg`;
              lose.currentTime=0;
              lose.volume=1
              lose.play();
              document.removeEventListener('keydown',moveBird);
              gameOver();
              
              
            }
             
            //update html
            context.font='30px monospace';
            context.fillStyle='black';
            context.textAlign='center';
            context.fillText(`score:${score}`,gridWidth/2,gridHeight/2,)
            
            
            
        }
        
}

function creatPipes(){
       if(isGameOver){
              return;
          }
      //remove extra pipes from array
      for(let i=0;i<pipeUps.length;i++){
            if(pipeUps[i].x<=0){
                  pipeUps.shift();
                  pipeDowns.shift();
            }
            
      }

      //creat a new pipe object
       const pipeUpY= -pipeHeight/4 - Math.random()*pipeHeight/2;
      
       pipeUp={
            Img: new Image(),
            x:800,
            y:pipeUpY,
            passed:false,
      }
      pipeUp.Img.src='pipeDown.png'
      // add this object in pipeUps for creation
      pipeUps.push(pipeUp);

      //creat a new pipeDown object
      const pipeDownY=pipeUpY+pipeHeight+gap+12;
      pipeDown={
            Img: new Image(),
            x:800,
            y:pipeDownY,
            passed:false,
      }
      pipeDown.Img.src='pipeUp.png'
      
      // add this object in pipeDowns for creation
      pipeDowns.push(pipeDown);
}

function moveBird(event){
        if(event.key===' '||event.key==='Enter'){
            wingSound.currentTime=0;
            wingSound.play();
            birdYvelocity=-6;
            
      }         
}

function gameOver(){
      setTimeout(
      function(){
       isGameOver=true;
       pipeDowns=[];
       pipeUps=[];
       bird.y=gridHeight/2;
       birdYvelocity=-6;
       //stop music
       dayMusic.pause();
       nightMusic.pause();
       //
       context.clearRect(0,0,gridWidth,gridHeight);
       clearInterval(pipeCreatorTimer);
       canvas.classList.add('hidden');
       menu.classList.remove('hidden');
       scoreDisplay.innerHTML=score;
       backgroundImg.classList.add(`landscape${landscapeStat.value}`);
       playerImg.classList.add(`player${playerStat.value}`);
       menuMusic.currentTime=0;
       menuMusic.play();

       
      },3000) 
}