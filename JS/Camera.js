var cameras = [];

function Camera(name, bMainCamera) {
    if (bMainCamera) {
        _unsubMainCamera();
        this.bMain = bMainCamera;
    }
    GameObject.call(this, name);
    cameras.push(this);
}

Camera.prototype = Object.create(GameObject.prototype);
Camera.prototype.constructor = Camera;

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

function _unsubMainCamera(){
    for (var i = 0; i < cameras.length; i++) {
        if (cameras[i].bMain) {
            cameras[i].bMain = false;
            break;
        }
    }
}