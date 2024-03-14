let ground;
let lander;
var lander_img;
var bg_img;
var bg2_img;
var stage1img
var stage2img
var rock1,rock2,rock3,rock4,rock5
var rockGroup
var heightAboveMoon = 2000
var gameState = 0
var stage2
var moonGround
var explosion
var lander_landed
var replay_button, replay
var over, overImg
var win, winImg
var start, startImg, begin
var rocket_plume, rocket_plume_sprite 
var rocket_L_plume, rocket_L_plume_sprite
var rocket_R_plume, rocket_R_plume_sprite
var bg_music
var rocket_sound
var explosion_sound
var instructions, instructionsImg
var move_speed_L = 0
var move_speed_R = 0
var key_L_down = 0
var key_R_down = 0
var key_space_down = 0
var debug = false

var vx = 0;
var g = 0.05;
var vy = 0;

function preload()
{
  lander_img = loadAnimation("normal.png");
  lander_landed = loadAnimation("ended.png")
  rock1 = loadImage("rock1.png")
  rock2 = loadImage("rock2.png")
  rock3 = loadImage("rock3.png")
  rock4 = loadImage("rock4.png")
  rock5 = loadImage("rock5.png")
  bg_img = loadImage("First_Stage.png");
  bg2_img = loadImage("Final_Stage.png")
  explosion = loadAnimation("explode_01.png","explode_02.png","explode_03.png","explode_04.png","explode_05.png","explode_06.png","explode_07.png")
  winImg = loadImage("YouWin_Header.png")
  overImg = loadImage("YouLose_Header.png")
  replay_button = loadImage("Replay_BTN.png")
  startImg = loadImage("Start_BTN.png")
  rocket_plume = loadAnimation("engine_firing.png")
  rocket_R_plume_sprite = loadAnimation("rocket_plume_R_2.png")
  rocket_L_plume_sprite = loadAnimation("rocket_plume_L_2.png")

  bg_music = loadSound("gredghrd.mp3")
  rocket_sound = loadSound("VASIMRLoop01.wav")
  explosion_sound = loadSound("fireworks_explosion_3.wav")
  instructionsImg = loadImage("Instructions.png")
}

function setup() {
  createCanvas(600, windowHeight)
  frameRate(80);
  bg_music.play()
  bg_music.setVolume(0.5)

  rockGroup=new Group()

  stage1img = createSprite(300,width/2,width, height)
  stage1img.addImage("stage1",bg_img)

  stage2 = createSprite(300,width/2,width, height)

  lander = createSprite(300,200);
  lander.addAnimation("lander",lander_img);
  lander.addAnimation("explosion",explosion)
  lander.addAnimation("landed",lander_landed)
  lander.addAnimation("engine",rocket_plume)
  lander.addAnimation("RCS L normal", rocket_L_plume_sprite)
  lander.addAnimation("RCS R normal", rocket_R_plume_sprite)

  lander.visible = false
  lander.scale = 0.1;
  rectMode(CENTER);
  textSize(15)
  
  replay = createSprite(300, windowHeight - 200, 20, 20)
  replay.addImage(replay_button)
  replay.visible = false
  replay.scale = 0.75

  start = createSprite(300,windowHeight - 400)
  start.addImage(startImg)
  start.visible = false

  instructions = createSprite(300, 300)
  instructions.addImage(instructionsImg)
  instructions.scale = 0.7
  instructions.visible = false

  win = createSprite(300, windowHeight - 400)
  win.addImage(winImg)
  win.visible = false

  over = createSprite(300, windowHeight - 400)
  over.addImage(overImg)
  over.visible = false
}

function draw() {

  console.log("Gamestate:",gameState)

  if (keyIsDown(18)){
      debug = true
      console.log("debug true")
  }

  if (gameState===0){
    stage1img.visible = true
    stage2.visible = false
    lander.visible = false
    text.visible = false
    start.visible = true
    instructions.visible = true
    
    if(lander.x > 551){
      lander.x = 550
    }
    if(lander.x < 50){
      lander.x = 51
    }
    
    if (mousePressedOver(start)){
      start.visible = false
      instructions.visible = false
      console.log("Start Button Pressed")
      gameState=1
      lander.changeAnimation("lander")
    }
  }
  
  if(gameState === 1){
    
    lander.visible = true
    lander.scale = 0.1
    stage2.visible = false

    if(lander.x > 551){
      lander.x = 550
    }
    if(lander.x < 50){
      lander.x = 51
    }

    if(lander.isTouching(rockGroup)){
      gameState = 4
    }

    rocks()
    background("black");

    if(debug == true){
      lander.debug = true
    }

    lander.setCollider("rectangle",0,0,650,650)

    if (stage1img.y < -50){
     stage1img.y = stage1img.width/2;
    }

    stage1img.velocityY = -3
    heightAboveMoon -= 1

    if(keyIsDown(RIGHT_ARROW)){
      lander.x += 3
      lander.changeAnimation("RCS L normal")
      key_R_down = 1
    }
    else
      key_R_down = 0
    
    if(keyIsDown(LEFT_ARROW)){
      lander.x -= 3
      lander.changeAnimation("RCS R normal")
      key_L_down = 1
    }
    else
      key_L_down = 0
    
    if(key_R_down == 0 & key_L_down == 0){
      lander.changeAnimation("lander")
    }

    if(heightAboveMoon < 500){
      gameState = 2
    }
  }

  if(gameState === 2){

    if(lander.isTouching(rockGroup)){
      gameState = 4
    }

    lander.visible = true
    stage2.visible = true

    if(lander.x > 551){
      lander.x = 550
      }
      if(lander.x < 50){
      lander.x = 51
      }

    stage2.addImage("stage2",bg2_img)
    stage2.velocityY = -3

    background("#4747471");
    stage1img

    if(heightAboveMoon == 300){
      stage1img.velocityY = 0
      stage2.velocityY = 0
      lander.velocityY = 3
    }

    if(heightAboveMoon < 300){
      camera.position.y = lander.position.y
      lander.velocityY += 0.10
      stage2.velocityY = 0
      moonGround = createSprite(300,1200,600,50)
      moonGround.visible = false
      text.visible = false

      if(moonGround.position.y - lander.position.y <= 50 && lander.velocityY > 5.5){
        gameState = 4
      }
      if(moonGround.position.y - lander.position.y <= 50 && lander.velocityY < 5.5){
        gameState = 3
      }

      lander.collide(moonGround)
      lander.setCollider("rectangle",0,0,25,120)

      if(debug == true){
        lander.debug = true
      }
  
      if(keyIsDown(32)) {
        lander.velocityY -= 0.25
        rocket_sound.play()
        lander.changeAnimation("engine")
        key_space_down = 1
      }
      else{
        if(gameState !==4){
          rocket_sound.stop()
          lander.changeAnimation("lander")
        }
        key_space_down = 0
      }
      
    }

      if(keyIsDown(RIGHT_ARROW)){
        lander.x += 3
        lander.changeAnimation("RCS L normal")
        key_R_down = 1
      }
      else
        key_R_down = 0
      

      if(keyIsDown(LEFT_ARROW)){
        lander.x -= 3
        lander.changeAnimation("RCS R normal")
        key_L_down = 1
      }
      else
        key_L_down = 0
    
      
      if(key_R_down == 0 & key_L_down == 0 & key_space_down == 0){
        lander.changeAnimation("lander")
      }

      heightAboveMoon -= 0.5

    if(heightAboveMoon < 300){
      rockGroup.destroyEach()      
    }
      
    if(rockGroup.isTouching(lander)){
      gameState = 4
    }
  }

  if(gameState === 3){
    lander.visible = true
    lander.changeAnimation("landed")
    lander.velocityY = 0
    replay.visible = true
    replay.position.y = windowHeight - 10
    win.position.y = windowHeight - 145
    win.visible = true
    rocket_sound.setVolume(0)

    if(mousePressedOver(replay) && gameState === 3 || gameState === 4){
      restart()
    }
  }

  if(gameState === 4){
    lander.visible = true
    lander.velocityY = 0
    lander.velocityX = 0
    lander.changeAnimation("explosion")
    lander.scale = 2
    rockGroup.setVelocityEach(0)
    stage1img.velocityY = 0
    over.visible = true
    explosion_sound.play()
    explosion_sound.setVolume(1)
    stage1img.velocityY = 0
    stage2.velocityY = 0
    replay.visible = true

    setTimeout(()=>{
      lander.visible = false
    },450);

    setTimeout(()=>{
     explosion_sound.stop()
     explosion_sound.setVolume(0)
    },300);

    if(mousePressedOver(replay) && gameState === 4 || gameState === 3){
      restart()
    }
  }
  
  drawSprites();
  push()
  fill(255);
  text("Meters above moon:"+heightAboveMoon,350,40)
  pop();
}

function restart(){
  location.reload()
}

function rocks(){
  if(frameCount%70==0){
      rock=createSprite(300,windowHeight + 100,10,10)
      rock.velocityY = -5
      rock.shapeColor = 100
      rock.x=Math.round(random(50,550))
      var rockran =Math.round(random(1,5))
      switch(rockran){
          case 1:
          rock.addImage(rock1)
          break

          case 2:
          rock.addImage(rock2)
          break

          case 3:
          rock.addImage(rock3)
          rock.scale = 0.6
          break

          case 4:
          rock.addImage(rock4)
          rock.scale = 0.6

          break

          case 5:
          rock.addImage(rock5)
          rock.scale = 0.6
          break

          default:
              break
      }
      rockGroup.add(rock)

      if(debug == true){
        rock.debug = true
      }
  }
}
