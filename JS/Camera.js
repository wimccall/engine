var cameras = [];

function Camera(name, bMainCamera) {
    if (bMainCamera) {
        _unsubMainCamera();
        this.bMain = bMainCamera;
    }
    GameObject.call(this, name);
    cameras.push(this);
    this.scale = new Vector2(1,1);
}

Camera.prototype = Object.create(GameObject.prototype);
Camera.prototype.constructor = Camera;

Camera.prototype.Start = function() {
    this.ResetZoom();
}

Camera.prototype.Update = function() {
    if (!this.bMain) return;
    if (this.attachedObj) {
        this.transform.position.x = this.attachedObj.transform.position.x
        this.transform.position.y = this.attachedObj.transform.position.y
    }
    world.pivot.x = this.transform.position.x;
    world.pivot.y = this.transform.position.y;
    world.position.x = app.renderer.width/2;
    world.position.y = app.renderer.height/2;
}

Camera.prototype.setMain = function () {
    _unsubMainCamera();
    this.bMain = true;
}

Camera.prototype.AttachCamera = function(gameobject) {
    this.attachedObj = gameobject;
}

Camera.prototype.SetDraggable = function() {
    var canvas = document.getElementsByClassName("engineViewport")[0];
    this.addDragNDrop();
    canvas.addEventListener('wheel', function (e) {
        if (!this.bMain) return;
        this.zoom(e.clientX, e.clientY, e.deltaY < 0);
    }.bind(this));
}

Camera.prototype.addDragNDrop = function() {
    var stage = app.stage;
    stage.interactive = true;
    var isDragging = false;
    var prevX, prevY;
    stage.mousedown = function (moveData) {
        if (!this.bMain) return;
        prevX = moveData.data.global.x; prevY = moveData.data.global.y;
        isDragging = true;
    }.bind(this);
    stage.mousemove = function (moveData) {
        if (!isDragging) {
            return;
        }
        this.position.x += (moveData.data.global.x - prevX);
        this.position.y += (moveData.data.global.y - prevY);
        prevX = moveData.data.global.x; prevY = moveData.data.global.y;
    };
    stage.mouseup = function (moveDate) {
        isDragging = false;
    };
}

Camera.prototype.zoom = function(x, y, isZoomIn) {
    direction = isZoomIn ? 1 : -1;
    var factor = (1 + direction * 0.1);
    world.scale.x *= factor;
    world.scale.y *= factor;

    // Technically code below is not required, but helps to zoom on mouse
    // cursor, instead center of graphGraphics coordinates
    var beforeTransform = getGraphCoordinates(x, y);
    world.updateTransform();
    var afterTransform = getGraphCoordinates(x, y);

    world.position.x += (afterTransform.x - beforeTransform.x) * world.scale.x;
    world.position.y += (afterTransform.y - beforeTransform.y) * world.scale.y;
    world.updateTransform();
}

Camera.prototype.ResetZoom = function() {
    world.scale.x = this.scale.x;
    world.scale.y = this.scale.y;
}

Camera.prototype.setScale = function(x, y) {
    if (x instanceof Vector2) this.scale = x;
    else {
        this.scale.x = x;
        this.scale.y = y;
    }
}

function _unsubMainCamera(){
    for (var i = 0; i < cameras.length; i++) {
        if (cameras[i].bMain) {
            cameras[i].bMain = false;
            break;
        }
    }
}

var getGraphCoordinates = (function () {
    var ctx = {
      global: { x: 0, y: 0} // store it inside closure to avoid GC pressure
    };
    return function (x, y) {
      ctx.global.x = x; ctx.global.y = y;
      return PIXI.interaction.InteractionData.prototype.getLocalPosition.call(ctx, world);
    }
}());