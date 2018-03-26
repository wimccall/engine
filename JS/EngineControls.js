/*
    This file contains controls for the guts of the game engine. including:
        * The game's innermost loop logic
        * functions for switching states e.g. the play button callback
    Notes:
        * the game state will always be in "play" mode in release mode versions of your game.    
*/

// This is the callback function which is called every frame in the game loop
let state = EditorState;

// Innermost game loop. Simply calls the state which the editor is in.
function gameLoop(delta){
    state(delta)
}

function PauseState() {
    // do nothing
}

// Loop that runs when the game is not playing. Called every frame while in edit mode to allow for edit mode scripts
var editorCam = new Camera("editCam", true);
editorCam.SetDraggable();
function EditorState() {
    editorCam.Update();
}

// This function is called every frame during gameplay. 
function PlayState(delta) {
    InputManager().PollGamepads();
    // First call the gameobjects physics update if they have any
    for (var i = 0; i < _gameobjects.length; i++) {
        _gameobjects[i].PUpdate();
    }
    // Then call all components regular update functions.
    for (var i = 0; i < _gameobjects.length; i++) {
        _gameobjects[i].Update();
    }
}

// Used to switch between the different game states
function switchState(stateName) {
    switchGameState(stateName);
    switchButtonState(stateName);
}

function switchButtonState(stateName) {
    var elButton = document.getElementById('playButton')
    switch (stateName) {
        case 'pause':
            elButton.className = 'playButton'
            elButton.onclick = function () { switchState("play"); };
            elButton.innerHTML = "&#9658;";
            break;
        case 'play':
            elButton.className = 'pauseButton'
            elButton.onclick = function () { switchState("pause"); };
            elButton.innerHTML = "&#10074;&#10074;";
            break;
        case 'editor':
            // TODO
            break;
        default:
            console.error("Trying to switchButtonState to an unknown state.")
    }
}

function switchGameState(stateName) {
    switch (stateName) {
        case 'pause':
            state = PauseState;
            runner.enabled = false;
            break;
        case 'play':
            if (state == EditorState) OnPlayStart();
            state = PlayState;
            runner.enabled = true;
            break;
        case 'editor':
            state = EditorState;
            break;
        default:
            console.error("Trying to switchGameState to an unknown state.")
    }
}

// Called when going from editor to play mode.

function OnPlayStart() {
    // TODO: Cache positions of gameobjects so that on hitting "stop" we can reset the scene... maybe?

    for (var i = 0; i < _gameobjects.length; i++) {
        _gameobjects[i].Start();
    }
    
    // TODO Delete this. This is a set up just to check things are working
    var a = 0;
    var b = 20;
    
    var ground = new GameObject("ground");
    var groundSprite = new PIXI.Graphics();
    var bpg = new BoxPhysics(ground, 1000, 1970, 2000, 60, { isStatic: true });
    groundSprite.beginFill(0xCCCCCC);
    groundSprite.pivot.set(2000/2, 60/2);
    groundSprite.drawRect(0, 0, 2000, 60);
    groundSprite.endFill();
    new SpriteRenderer(ground, groundSprite);
    
    var wall1 = new GameObject("wall1");
    var wallSprite1 = new PIXI.Graphics();
    var bpw1 = new BoxPhysics(wall1, 30, 1000, 60, 2000, { isStatic: true });
    wallSprite1.beginFill(0xCCCCCC);
    wallSprite1.pivot.set(60/2, 2000/2);
    wallSprite1.drawRect(0, 0, 60, 2000);
    wallSprite1.endFill();
    new SpriteRenderer(wall1, wallSprite1);
    
    var wall2 = new GameObject("wall2");
    var wallSprite2 = new PIXI.Graphics();
    var bpw2 = new BoxPhysics(wall2, 1970, 1000, 60, 2000, { isStatic: true });
    wallSprite2.beginFill(0xCCCCCC);
    wallSprite2.pivot.set(60/2, 2000/2);
    wallSprite2.drawRect(0, 0, 60, 2000);
    wallSprite2.endFill();
    new SpriteRenderer(wall2, wallSprite2);
    
    var ceiling = new GameObject("ground");
    var ceilingSprite = new PIXI.Graphics();
    var bpc = new BoxPhysics(ceiling, 1000, 30, 2000, 60, { isStatic: true });
    ceilingSprite.beginFill(0xCCCCCC);
    ceilingSprite.pivot.set(2000/2, 60/2);
    ceilingSprite.drawRect(0, 0, 2000, 60);
    ceilingSprite.endFill();
    new SpriteRenderer(ceiling, ceilingSprite);

    window.setTimeout(function ab(){
        var size = Math.floor(Math.random() * 200 + 20);
        var m = Math.sqrt(size) * (Math.random()/2 + 1);
        m == 0 ? m = 1 : m;
        var g = new GameObject(a.toString());
        let circle = new PIXI.Graphics();
        circle.beginFill(0x9966FF);
        circle.drawCircle(0, 0, size);
        circle.endFill();
        new SpriteRenderer(g, circle);
        var cp = new CirclePhysics(g, 0, 0, size);
        cp.setMass(m);
        cp.setPosition(Math.floor(Math.random() * 1600), Math.floor(Math.random() * 1600))
        cp.setVelocity(Math.floor(Math.random() * size), Math.floor(Math.random() * size))
        cp.setGravityScale(1);
        a++;
        if (a == 1) cam.AttachCamera(g);
        if (a < 20) window.setTimeout(ab, 200);
    }, 500);
    
    window.setTimeout(function boxes(){
        var size = Math.floor(Math.random() * 200 + 20);
        var m = Math.sqrt(size) * (Math.random()/2 + 1);
        m == 0 ? m = 1 : m;
        var g = new GameObject(b.toString());
        let box = new PIXI.Graphics();
        box.beginFill(0x9966FF);
        box.drawRect(0, 0, size, size);
        box.pivot.set(size/2, size/2);
        box.endFill();
        new SpriteRenderer(g, box);
        var bp = new BoxPhysics(g, 0, 0, size, size);
        bp.setMass(m);
        bp.setPosition(Math.floor(Math.random() * 1600), Math.floor(Math.random() * 1600))
        bp.setVelocity(Math.floor(Math.random() * size) - (.5 * size), Math.floor(Math.random() * size) - (.5 * size))
        bp.setGravityScale(-1);
        b++;
        if (b < 40) window.setTimeout(boxes, 200);
    }, 500);

    var cam = new Camera(undefined, true);
    
}