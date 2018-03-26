// ** Renderer
// PIXI Aliases
let Application = PIXI.Application,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    isCompatible = PIXI.utils.isWebGLSupported,
    Rectangle = PIXI.Rectangle;

// Check if WebGL is supported
let type = "WebGL"
if(!isCompatible()){
  type = "canvas"
}

PIXI.utils.sayHello(type)

// Set up the application
let app = new Application()

function setUpRenderer() {
  app.renderer.backgroundColor = 0x061639;
  var elRend = document.getElementById('rendererContainer');
  app.renderer.resize(2000, 2000);
  var elApp = elRend.appendChild(app.view);
  elApp.className = 'engineViewport'
  
  app.renderer.render(app.stage);
  app.ticker.add(delta => gameLoop(delta));
  let circle = new PIXI.Graphics();
  circle.beginFill(0xDA102D);
  circle.drawCircle(0, 0, 20);
  circle.endFill();
  app.stage.addChild(circle);
}

// ** Physics
// module aliases
let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;

// create an engine
var engine = Engine.create();
var runner;

function startPhysicsSim() {    
    // run the engine
    runner = Engine.run(engine);
}

setUpRenderer();
startPhysicsSim();