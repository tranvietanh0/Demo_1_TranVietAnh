import { _decorator, Component, Node, CCInteger, Input, input, EventKeyboard, KeyCode, director, Contact2DType, Collider2D, IPhysics2DContact } from 'cc';
const { ccclass, property } = _decorator;

import { Ground } from './Ground';
import { Results } from './Results';
import { Bird } from './Bird';
import { PipePool } from './PipePool';
import { BirdAudio } from './BirdAudio';

@ccclass("GameCtrl")
export class GameCtrl extends Component {
  @property({
    type: Component,
    tooltip: "Add ground prefab owner here",
  })
  public ground: Ground;

  @property({
    type: CCInteger,
    tooltip: "Change the speed of ground",
  })
  public speed: number = 200;

  @property({
    type: CCInteger,
    tooltip: "Change the speed of pipes",
  })
  public pipeSpeed: number = 200;

  @property({
    type: Results,
    tooltip: "Add results here",
  })
  public result: Results;

  @property({
    type: Bird,
    tooltip: "Add Bird node",
  })
  public bird: Bird;

  @property({
    type: PipePool,
    tooltip: "Add canvas here",
  })
  public pipeQueue: PipePool;

  @property({
    type: BirdAudio,
    tooltip: "add audio controller",
  })
  public clip: BirdAudio;

  //needed to tell the game it's over
  public isOver: boolean;

  //things to do when the game loads
  onLoad() {
    
    //get listener started
    this.initListener();

    //reset score to zero
    this.result.resetScore();

    //game is over
    this.isOver = true;

    //pause the game
    director.pause();

  }

  //listener for the mouse clicks and keyboard
  initListener() {
    
    //if keyboard key goes down, go to onKeyDown
    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);

    //if an mouse or finger goes down, do this
    this.node.on(Node.EventType.TOUCH_START, () => {
      
      //if we are starting a new game
      if (this.isOver == true) {
        
        //reset everything and start the game again
        this.resetGame();
        this.bird.resetBird();
        this.startGame();
    
      }

      //if the game is playing
      if (this.isOver == false) {
        
        //have Bird fly
        this.bird.fly();

        //make the bird go swoosh
        this.clip.onAudioQueue(0);
      }

    })

  }

  //for testing purposes, we use this. But hide as comments after you finish the game
  onKeyDown(event: EventKeyboard) {
    switch (event.keyCode) {
      case KeyCode.KEY_A:
        //end game
        this.gameOver();
        break;
      case KeyCode.KEY_P:
        //add one point
        this.result.addScore();
        break;
      case KeyCode.KEY_Q:
        //reset score to zero
        this.resetGame();
        this.bird.resetBird();
    }
  }

  //when the bird hits something, run this
  gameOver() {
    
    //show the results
    this.result.showResult();

    //game is over
    this.isOver = true;

    //make the game over sound
    this.clip.onAudioQueue(3);
    
    //pause the game
    director.pause();
  
  }

  //when the game starts again, do these things.
  resetGame() {
    
    //reset score, bird, and pipes
    this.result.resetScore();

    //reset the pipes
    this.pipeQueue.reset();

    //game is starting
    this.isOver = false;

    //get objects moving again
    this.startGame();

  }

  //what to do when the game is starting.
  startGame() {
    
    //hide high score and other text
    this.result.hideResult();

    //resume game
    director.resume();

  }

  //when a pipe passes the bird, do this
  passPipe() {
    
    //passed a pipe, get a point
    this.result.addScore();

    //make the point ring
    this.clip.onAudioQueue(1);
  
  }

  //when the old pipe goes away, create a new pipe
  createPipe() {
    
    //add a new pipe to the pipe pool
    this.pipeQueue.addPool();

  }

  //check if there was contact with the bird and objects
  contactGroundPipe() {
    
    //make a collider call from the bird's collider2D component
    let collider = this.bird.getComponent(Collider2D);

    //check if the collider hit other colliders
    if (collider) {
      collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }

  }

  //if you hit something, tell the bird you did
  onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {

    //will be called once when two colliders begin to contact
    this.bird.hitSomething = true;

    //make the hit sound
    this.clip.onAudioQueue(2);

  }

  //hit detection call
  birdStruck() {
  
    //make a call to the gameBrain to see if it hit something.
    this.contactGroundPipe()

    //if we hit it, tell the game to call game over.
    if (this.bird.hitSomething == true)
    {
        this.gameOver();
    }
      
  }

  //every time the game updates, do this
  update(){

    //if the game is still going, check if the bird hit something
    if (this.isOver == false){
        this.birdStruck();
    }
    
  }

}


