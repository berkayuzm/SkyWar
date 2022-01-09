var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var warning=document.getElementById("warning");
var gecenDusman=0;
var playerList=[];
var bulletList=[];
var enemyList=[];
const bulletSpeed=10;
const bulletHeight=20;
const bulletWidth=20;
const fire_reload_time=1500;
const enemy_spawn_time=800;
const playerDW=6240/12;
const playerDH=420;
const enemyDW=93.5;
const enemyDH=161;
const enemySpeed=1.4;
var score=0;
var gameLoopTime=1000/60;
var isGameFinish=false;
let fireSound=new Audio("sound/fire.mp3");
let gameoverSound=new Audio("sound/gameover.mp3");
const playerSize={
    x:75,
    y:75

}
const bulletImage=new Image();
const enemyImage=new Image();
const playerImage=new Image();
const backgroundImage=new Image();
bulletImage.src='img/bullet.png';
backgroundImage.src='img/background2.jpg';
playerImage.src='img/player.png';
enemyImage.src='img/enemy.png';
var start = new Date().getTime();


const playerColor="#0000ff";
var playerHealth=100;

canvas.addEventListener("mousedown",e=>{
GameControl.createPlayer(playerSize.x,playerSize.y,e.offsetX,e.offsetY,playerColor,playerHealth)


});

class Player{

    constructor(height,width,x,y,color,health){
        this.isFire=true;
        this.height=height;
        this.width=width;
        this.x=x;
        this.y=y;
        this.color=color;
        this.health=health;
        this.myInterval;
        
        this.fire();
       
    }

    fire(){
        let fireCounter =0;
        
        this.myInterval=setInterval(()=>{
       
        new Bullet(bulletWidth,bulletHeight,this.x+40,this.y,bulletSpeed);
        fireCounter++;
        
        if(fireCounter===3){
            this.destroyPlayer();
        }
      },fire_reload_time)

        }


        destroyPlayer(){
            
            clearInterval(this.myInterval)
            GameControl.playerYokEt();
                
           

        }
       

  
}
class Bullet{

    constructor(height,width,x,y,speed){
        this.height=height;
        this.width=width;
        this.speed=speed;
        this.x=x;
        this.y=y;
        this.move();
        bulletList.push(this);
       
       
    }


    

    move(){
        setInterval(()=> {
            this.x +=this.speed;
        }, 10);
        
    }
}
class Enemy{
    
    constructor(x,y,width,height,speed){
        this.width=width;
        this.x=x;
        this.y=y;
        this.height=height;
        this.speed=speed;
        this.move();
       
       
    }
    move(){
        setInterval(()=> {
            this.x -=this.speed;
        }, 1000/60);
        
    }
}
class GameControl{
    
    
    static createPlayer(height,width,x,y,color,health){
        if(playerList.length<3 && !isGameFinish){
            
            playerList.push( new Player(height,width,x,y,color,health)  )
            
        }
        else{
                warning.innerHTML ="Daha fazla üretemezsin sakin ol!";
                setTimeout(() => {
                warning.innerHTML ="";
                    
                }, 2000);
            }        
    }

    static createEnemy(){
       
       var enemy_Y= Math.floor(Math.random() * 500);
        enemyList.push(new Enemy(900,enemy_Y,50,50,enemySpeed))
    }

    playerCanAzalt(){

    }

    enemyCanAzalt(){

    }

     static enemyYokEt(){
       
        
        for(let i=0;i<enemyList.length;i++){
            if(enemyList[i].x<=20){
                enemyList.splice(i,1);
                gecenDusman++;
               
                if(gecenDusman>3){
                    gameoverSound.play();
                    isGameFinish=true;
                }
            }
        }

    }

    static bulletYokEt(){
        for(let i=0;i<bulletList.length;i++){
            if(bulletList[i].x>=910){
               bulletList.splice(i,1);
            }
        }
    }
    static playerYokEt(a){

        playerList.splice(0,1);
       
       
    }
    static isCollision(enemyList,bulletList){

        for(let i=0;i<bulletList.length;i++){

            for(let a=0;a<enemyList.length;a++){

                if(bulletList[i].x<enemyList[a].x+enemyList[a].width &&
                   bulletList[i].x+bulletList[i].width>enemyList[a].x &&
                   bulletList[i].y<enemyList[a].y+enemyList[a].height &&
                   bulletList[i].y+bulletList[i].height>enemyList[a].y 
                    )

                    {
                       enemyList.splice(a,1);
                       bulletList.splice(i,1)
                       score+=100;
                       break;
                    
                    
                        
                    }
                   
            }
        }


    }

  

}
setInterval(()=>{
    GameControl.createEnemy();
},enemy_spawn_time)



function gameLoop(){
    
        let animateA=5;
        let animateB=3;
        let playerAnimate=0;
        setInterval(()=>{
            var elapsed = new Date().getTime() - start;
           
          
            if(elapsed %5===0){
                playerAnimate++;
                if(playerAnimate===12){
                    playerAnimate=0;
                }
                if (animateA>0){
                    animateA--;
            
                }
                else if(animateA===0){
                   
                    animateA=5;
                    animateB--;
                
                     if (animateB===0){
                      
                        animateB=3;
                        animateA=5;}
                }
               
                
               
            }
    
            GameControl.isCollision(enemyList,bulletList);
            GameControl.enemyYokEt();
            GameControl.bulletYokEt();
           
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(backgroundImage,0,0,900,600);
            if(isGameFinish===true){
                ctx.fillStyle = "red";
            ctx.font = "40px Arial";
            ctx.fillText("Merkezin işgal edildi!", 0, 100);
            ctx.fillText("GAME OVER!", 0, 100);
            ctx.fillText("Yeniden başlamak için sayfayı yenile!", 0, 200);
            ctx.fillText("Puanın="+score, 0, 250);
          
            }
            ctx.fillStyle = "white";
            ctx.font = "30px Arial";
            ctx.fillText("Score="+score, 10, 50);
            for (let i = 0; i < bulletList.length; i++) {
                ctx.drawImage(bulletImage ,0,0,260,180,bulletList[i].x,bulletList[i].y,bulletList[i].width,bulletList[i].height)  
            
            }
    
              for (let i = 0; i < playerList.length; i++) {
                
               // ctx.fillRect(playerList[i].x,playerList[i].y,playerList[i].width,playerList[i].height);
                ctx.drawImage(playerImage,playerAnimate*playerDW,0,playerDW,playerDH,playerList[i].x,playerList[i].y,playerList[i].width,playerList[i].height)
            }
              for (let i = 0; i < enemyList.length; i++) {
               
                ctx.drawImage(enemyImage,animateA*enemyDW,animateB*enemyDH,enemyDW,enemyDH,enemyList[i].x,enemyList[i].y,enemyDW/2,enemyDH/2);
            }
              
        },gameLoopTime)
    
    }
   

gameLoop();

