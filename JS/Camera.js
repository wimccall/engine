var cameras = [];

function Camera(name, bMainCamera, viewPortSize) {
    if (bMainCamera) {
        _unsubMainCamera();
        this.bMain = bMainCamera;
    }
    GameObject.call(this, name);
    cameras.push(this);
    this.viewPortSize = viewPortSize;
}

Camera.prototype = Object.create(GameObject.prototype);
Camera.prototype.constructor = Camera;

Camera.prototype.Start = function() {
    
}

Camera.prototype.Update = function() {
    if (this.attachedObj) {
        this.transform.position.x = this.attachedObj.transform.position.x
        this.transform.position.y = this.attachedObj.transform.position.y
    }
    if (this.bMain) {
        app.stage.pivot.x = this.transform.position.x;
        app.stage.pivot.y = this.transform.position.y;
        app.stage.position.x = app.renderer.width/2;
        app.stage.position.y = app.renderer.height/2;
    }
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
    this.bDragging = false;
    // TODO: add mousedown, mousemove, mouseup and mouseleave event listeners
    canvas.addEventListener('mousedown', function (e) {
        this.bDragging = true;
        this.refScreenX = e.screenX;
        this.refScreenY = e.screenY;
    }.bind(this));
    canvas.addEventListener('mouseup', function (e) {
        this.bDragging = false;
    }.bind(this));
    canvas.addEventListener('mousemove', function (e) {
        if (!this.bDragging) return;
        this.transform.position.x -= e.screenX - this.refScreenX
        this.transform.position.y -= e.screenY - this.refScreenY
        this.refScreenX = e.screenX;
        this.refScreenY = e.screenY;
    }.bind(this));
    canvas.addEventListener('mouseleave', function (e) {
        this.bDragging = false;
    }.bind(this));
    canvas.addEventListener('wheel', function (e) {
        app.renderer.resize(app.renderer.screen.width * ((1000 + e.deltaY) / 1000), app.renderer.screen.height * ((1000 + e.deltaY) / 1000));
    }.bind(this));
}

function _unsubMainCamera(){
    for (var i = 0; i < cameras.length; i++) {
        if (cameras[i].bMain) {
            cameras[i].bMain = false;
            break;
        }
    }
}