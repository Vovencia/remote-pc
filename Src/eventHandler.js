"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_EVENT = exports.eventHandler = void 0;
const robotjs_1 = __importDefault(require("robotjs"));
function eventHandler(event, args) {
    switch (event) {
        case API_EVENT.CURSOR_MOVE:
            return void mouseMove(...args);
        case API_EVENT.CURSOR_CLICK:
            return void mouseCLick();
        case API_EVENT.CURSOR_RIGHT_CLICK:
            return void mouseCLick(true);
        case API_EVENT.KEYBOARD_BACK:
            return void keyboardClick('escape');
        case API_EVENT.KEYBOARD_UP:
            return void keyboardClick('up');
        case API_EVENT.KEYBOARD_DOWN:
            return void keyboardClick('down');
        case API_EVENT.KEYBOARD_LEFT:
            return void keyboardClick('left');
        case API_EVENT.KEYBOARD_RIGHT:
            return void keyboardClick('right');
        case API_EVENT.KEYBOARD_OK:
            return void keyboardClick('enter');
        case API_EVENT.KEYBOARD_MENU:
            return void keyboardClick('menu');
        case API_EVENT.KEYBOARD_PLAY:
            return void keyboardClick('audio_play');
        case API_EVENT.KEYBOARD_PAUSE:
            return void keyboardClick('audio_pause');
        case API_EVENT.KEYBOARD_STOP:
            return void keyboardClick('audio_stop');
    }
}
exports.eventHandler = eventHandler;
function mouseMove(x, y) {
    const mousePos = robotjs_1.default.getMousePos();
    robotjs_1.default.moveMouse(mousePos.x + x, mousePos.y + y);
}
function mouseCLick(isRight = false) {
    if (isRight) {
        robotjs_1.default.mouseClick('right', false);
    }
    else {
        robotjs_1.default.mouseClick('left', false);
    }
}
function keyboardClick(key) {
    robotjs_1.default.keyTap(key);
}
var API_EVENT;
(function (API_EVENT) {
    API_EVENT[API_EVENT["UNKNOWN"] = 0] = "UNKNOWN";
    API_EVENT[API_EVENT["CURSOR_MOVE"] = 1] = "CURSOR_MOVE";
    API_EVENT[API_EVENT["CURSOR_CLICK"] = 2] = "CURSOR_CLICK";
    API_EVENT[API_EVENT["CURSOR_RIGHT_CLICK"] = 3] = "CURSOR_RIGHT_CLICK";
    API_EVENT[API_EVENT["KEYBOARD_UP"] = 4] = "KEYBOARD_UP";
    API_EVENT[API_EVENT["KEYBOARD_DOWN"] = 5] = "KEYBOARD_DOWN";
    API_EVENT[API_EVENT["KEYBOARD_LEFT"] = 6] = "KEYBOARD_LEFT";
    API_EVENT[API_EVENT["KEYBOARD_RIGHT"] = 7] = "KEYBOARD_RIGHT";
    API_EVENT[API_EVENT["KEYBOARD_BACK"] = 8] = "KEYBOARD_BACK";
    API_EVENT[API_EVENT["KEYBOARD_OK"] = 9] = "KEYBOARD_OK";
    API_EVENT[API_EVENT["KEYBOARD_MENU"] = 10] = "KEYBOARD_MENU";
    API_EVENT[API_EVENT["KEYBOARD_PLAY"] = 11] = "KEYBOARD_PLAY";
    API_EVENT[API_EVENT["KEYBOARD_PAUSE"] = 12] = "KEYBOARD_PAUSE";
    API_EVENT[API_EVENT["KEYBOARD_STOP"] = 13] = "KEYBOARD_STOP";
})(API_EVENT = exports.API_EVENT || (exports.API_EVENT = {}));
