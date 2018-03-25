var Observer = {
    subjects : [],
    SendMessage : function(message, data) {
        for(var i = 0; i < this.subjects.length; i++) {
            if (this.subjects[i].message === message) {
                this.subjects[i].SendMessage(data);
                return;
            }
        }
        var sub = new Subject(message);
        sub.SendMessage(data);
        this.subjects.push(sub);
    },
    AddListener : function(message, callback) {
        for(var i = 0; i < this.subjects.length; i++) {
            if (this.subjects[i].message === message) {
                this.subjects[i].AddCallback(callback);
                return;
            }
        }
        var sub = new Subject(message);
        sub.AddCallback(callback);
        this.subjects.push(sub);
    },
    RemoveListener : function(message, fn) {
        for (var i = 0; i < this.subjects.length; i++) {
            if (this.subjects[i].message === message) {
                this.subjects[i].RemoveListener(fn);
                return;
            }
        }
    }
}

function Subject(message) {
    this.message = message;
    this.cbs = [];
}

Subject.prototype.SendMessage = function(data) {
    for(var i = 0; i < this.cbs.length; i++){
        this.cbs[i](data);
    }
}

Subject.prototype.AddCallback = function(cb) {
    this.cbs.push(cb);
}

Subject.prototype.RemoveListener = function(cb){
    this.cbs = this.cbs.filter((subscriber) => subscriber !== cb);
}