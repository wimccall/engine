/*
    This file contains the definitions for many classes related to the core game engine.
        * GameObject
        * Transform
        * Vector3
        * Vector2
        * Component
        * SpriteRenderer
    
    It also contains some global variables and functions for the engine.
        * _gameobjects -- A list of all the GameObjects in the game.
        * FindObjectWithName(string)
        * FindObjectsWithName(string) 
*/

// ** Related global variables and functions. 

//This is the list of GameObjects for the game to loop over and update, find, etc. 
var _gameobjects = []

// This global function finds the first GameObject with the specified name -- if it exists
function FindGameObjectWithName (name) {
    for (var i = 0; i < _gameobjects.length; i++) {
        if (_gameobjects[i].name === name) return _gameobjects[i];
    }
    return false;
}

// This global function finds all GameObjects with the specified name -- if they exist
function FindGameObjectsWithName (name) {
    var aG = []
    for (var i = 0; i < _gameobjects.length; i++) {
        if (_gameobjects[i].name === name) aG.push(_gameobjects[i]);
    }
    return aG;
}

// ** Object definitions
function GameObject (name) {
    _gameobjects.push(this);
    this.transform = new Transform();
    this.components = [];
    this.physicsComponents = [];
    if (typeof name === "string") this.name = name;
}

function Transform () {
    this.position = new Vector2(0, 0);
    this.rot = 0;
    this.scale = new Vector2(0, 0);
}

function Vector3 (x, y, z) {
    if (!isNaN(x)) this.x = x
    else this.x = 0;
    if (!isNaN(y)) this.y = y
    else this.y = 0;
    if (!isNaN(z)) this.z = z
    else this.z = 0;
}

function Vector2 (x, y) {
    if (!isNaN(x)) this.x = x
    else this.x = 0;
    if (!isNaN(y)) this.y = y
    else this.y = 0;
}

function Component (ownerObject) {
    if (this.constructor === Component) {
        throw new Error("Can't instantiate abstract class!");
    }
    if (ownerObject === undefined) {
        console.error("instantiating a Component class without passing in the owning GameObject");
        return; // No owner object, no SpriteRenderer.
    }
    this.gameobject = ownerObject;
    this.gameobject.components.push(this);
}

function PhysicsComponent (ownerObject, body) {
    Component.call(this, ownerObject)
    if (this.constructor === PhysicsComponent) {
        throw new Error("Can't instantiate abstract class!");
    }
    this.body = body;
    this.gameobject.physicsComponents.push(this);
    this.body.restitution = .8;
}

function SpriteRenderer (ownerObject, sprite) { // Pass in a PIXI sprite
    Component.call(this, ownerObject);
    this.sprite = sprite;
    app.stage.addChild(sprite);
}

function CirclePhysics (ownerObject, x, y, radius, options) {
    this.body = new Bodies.circle(x, y, radius, options);
    PhysicsComponent.call(this, ownerObject, this.body);
    World.add(engine.world, this.body);
}

function BoxPhysics (ownerObject, x, y, width, height, options) {
    this.body = new Bodies.rectangle(x, y, width, height, options);
    PhysicsComponent.call(this, ownerObject, this.body);
    World.add(engine.world, this.body);
}

// ** Member functions

// ** GameObject
GameObject.prototype.Update =  function() {
    for(var i = 0; i < this.components.length; i++) {
        if (typeof this.components[i].Update === 'function') this.components[i].Update();
    }
}

GameObject.prototype.PUpdate = function() {
    for(var i = 0; i < this.physicsComponents.length; i++) {
        this.physicsComponents[i].PUpdate();
    }
}

GameObject.prototype.Start = function() {
    for(var i = 0; i < this.components.length; i++) {
        this.components[i].Start();
    }
}

GameObject.prototype.setName = function(name) {
    if (typeof name === "string") this.name = name;
}

// Find the first component with the given name. If it doesn't exist, return false.
GameObject.prototype.findComponentOfName = function(name) {
    for (var i = 0; i < this.components.length; i++) {
        if (this.components[i].name === name) return this.components[i]
    }
    return false;
}

// Find all components of given name.
GameObject.prototype.findComponentsOfName = function(name) {
    var aC = [];
    for (var i = 0; i < this.components.length; i++) {
        if (this.components[i].name === name) ac.push(this.components[i])
    }
    return ac;
}

// ** Transform
Transform.prototype.setPosition = function(x, y) {
    if (!isNaN(x)) this.position.x = x;
    if (!isNaN(y)) this.position.y = y;
}

Transform.prototype.setScale = function(x, y) {
    if (!isNaN(x)) this.scale.x = x;
    if (!isNaN(y)) this.scale.y = y;
}

// **  SpriteRenderer
SpriteRenderer.prototype = Object.create(Component.prototype);
SpriteRenderer.prototype.constructor = SpriteRenderer;

SpriteRenderer.prototype.Update = function() {
    this.sprite.position.set(this.gameobject.transform.position.x, this.gameobject.transform.position.y);
    this.sprite.rotation = this.gameobject.transform.rot;
}

// ** Component
Component.prototype.Update = function() {
    return;
}

Component.prototype.Start = function() {
    return;
}

// ** PhysicsComponent
// Extend the Component methods
PhysicsComponent.prototype = Object.create(Component.prototype);
PhysicsComponent.prototype.constructor = PhysicsComponent;

PhysicsComponent.prototype.PUpdate = function() {
    this.gameobject.transform.position.x = this.body.position.x;
    this.gameobject.transform.position.y = this.body.position.y;
    this.gameobject.transform.rot = this.body.angle;
}

// TODO
PhysicsComponent.prototype.setVelocity = function(x, y) {
    if (!(x instanceof Vector2)) {
        Matter.Body.set(this.body, 'velocity', {x: x, y: y});
    } else {
        Matter.Body.set(this.body, 'velocity', {x: x.x, y: x.y});
    }
}
// TODO
PhysicsComponent.prototype.setPosition = function(x, y) {
    if (!(x instanceof Vector2)) {
        Matter.Body.set(this.body, 'position', {x: x,y: y});
    } else {
        Matter.Body.set(this.body, 'position', {x: x.x,y: x.y});
    }
}
// TODO
PhysicsComponent.prototype.setMass = function(m) {
    if (!isNaN(m)) Matter.Body.set(this.body, 'mass', m);
}

// TODO
PhysicsComponent.prototype.setGravityScale = function (g) {
    this.body.gravityScale = g;
}

PhysicsComponent.prototype.SetBounce = function(bounce) {
    if (bounce <= 1 && bounce >=0) {
        this.body.restitution = bounce;
    } else console.error("SetBounce bounce value must be between 0 and 1");
}

// ** CirclePhysics
// Extend PhysicsComponent Methods
CirclePhysics.prototype = Object.create(PhysicsComponent.prototype);
CirclePhysics.prototype.constructor = CirclePhysics;

// ** BoxPhysics
BoxPhysics.prototype = Object.create(PhysicsComponent.prototype);
BoxPhysics.prototype.constructor = BoxPhysics;