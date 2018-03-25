// ** Input manager class. 
//      This class is a wrapper for Input based on browser events.
//      https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
//      https://developer.mozilla.org/en-US/docs/Games/Techniques/Controls_Gamepad_API

function GamepadState() {
    this.buttons = [];
    this.axes = [];
}

function Gamepad(gamepad) {
    this.GamepadStateCache = new GamepadState()
    this.GamepadStateCurrent = new GamepadState();
    this.buttonNames = [];

    // Set default button names
    for (var i = 0; i < gamepad.buttons.length; i++) {
        this.buttonNames.push('GamepadButton' + i);
    }

    this.pad = gamepad;
}

var InputManagerinstance;
function InputManager() {
    // Singleton. We don't want anyone instantiating this class except for us.
    if (InputManagerinstance) return InputManagerinstance;

    InputManagerinstance = {
        gamepads : [],
        // the state of the gamepad in the previous frame
        // activeGamepads : {},
        
        // Chrome does things differently than other browsers, so we use this bool to test
        haveEvents : ('ongamepadconnected' in window),

        GamepadConnected : function (event) {
            console.log("GamepadConnected")
            var gamepad = event.gamepad;
            InputManagerinstance.AddGamepad(gamepad)
        },

        AddGamepad : function (gamepad) {
            InputManagerinstance.gamepads[gamepad.index] = new Gamepad(gamepad);
        },

        GamepadDisconnected : function(event) {
            console.log("GamepadDisconnected")
            var gamepad = event.gamepad;
            InputManagerinstance.RemoveGamepad(gamepad)
        },

        RemoveGamepad : function (gamepad) {
            delete InputManagerinstance.gamepads[gamepad.index];
            InputManagerinstance.gamepads.splice(gamepad.index,1)
        },

        PollGamepads : function() {
            if (!InputManagerinstance.haveEvents) {
                InputManagerinstance.ScanGamepads();
            } 

            for (var i = 0; i < InputManagerinstance.gamepads.length; i++) {
                var gamepad = InputManagerinstance.gamepads[i];

                // Clear the previous controller state
                gamepad.GamepadStateCache.buttons = [];

                // Copy the current state into the previous state
                for (var j = 0; j < gamepad.GamepadStateCurrent.buttons.length; j++) {
                    gamepad.GamepadStateCache.buttons.push(gamepad.GamepadStateCurrent.buttons[j]);
                }

                // Clear the current state
                gamepad.GamepadStateCurrent.buttons = [];

                var pressed = [];
                
                // loop through buttons and push the pressed ones to the array
                if(gamepad.pad.buttons) {
                    for(var b=0,t=gamepad.pad.buttons.length; b<t; b++) {
                        if(gamepad.pad.buttons[b].pressed) {
                            pressed.push(gamepad.buttonNames[b]);
                            if (!gamepad.GamepadStateCache.buttons.includes(gamepad.buttonNames[b])) Observer.SendMessage('buttonPressed', gamepad.buttonNames[b]);
                        }
                    }
                }

                // loop through axes and push their values to the array
                var axes = [];
                if(gamepad.pad.axes) {
                    for(var a=0,x=gamepad.pad.axes.length; a<x; a++) {
                        axes.push(gamepad.pad.axes[a].toFixed(2));
                    }
                }
                // assign received values
                gamepad.GamepadStateCurrent.axes = axes;
                gamepad.GamepadStateCurrent.buttons = pressed;
            }
        },

        ScanGamepads : function() {  
            var controllers = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
            for (var i = 0; i < InputManagerinstance.gamepads.length; i++) {
                if (controllers[i]) {
                    if (controllers[i].index in InputManagerinstance.gamepads) {
                        InputManagerinstance.gamepads[controllers[i].index].pad = controllers[i];
                    } else {
                        InputManagerinstance.AddGamepad(controllers[i]);
                    }
                }
            }
        },
    }
    window.addEventListener("gamepadconnected", InputManagerinstance.GamepadConnected);
    window.addEventListener("gamepaddisconnected", InputManagerinstance.GamepadDisconnected);
    console.log("inputManager Initialized");
    return InputManagerinstance;
}