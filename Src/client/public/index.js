"use strict";
(function () {
    const app = new (class Application {
        constructor() {
            this.isAreaPressed = false;
            this.lastCursorPosition = [0, 0];
            this.sendQueue = [];
            this.sending = false;
            this.handlerAreaPressStart = (event) => {
                this.isAreaPressed = true;
                this.lastCursorPosition = this.getPoint(event);
            };
            this.handlerAreaPressEnd = (event) => {
                this.isAreaPressed = false;
            };
            this.handlerAreaPressMove = (event) => {
                if (!this.isAreaPressed) {
                    return;
                }
                const cursorPosition = this.getPoint(event);
                const move = [
                    cursorPosition[0] - this.lastCursorPosition[0],
                    cursorPosition[1] - this.lastCursorPosition[1],
                ];
                this.lastCursorPosition = cursorPosition;
                void this.sendEvent(API_EVENT.CURSOR_MOVE, move[0], move[1]);
            };
            this.handlerAreaClick = () => {
                void this.sendEvent(API_EVENT.CURSOR_CLICK);
            };
            this.handlerButtonClick = (event) => {
                window.navigator.vibrate(50);
                const target = event.target;
                const type = target.getAttribute('data-button');
                switch (type) {
                    case 'switch':
                        const $area = document.querySelector('.area');
                        const type = $area.getAttribute('data-type');
                        const nextType = {
                            touch: 'controls',
                            controls: 'touch',
                        };
                        $area.setAttribute('data-type', nextType[type]);
                        return;
                    case 'click':
                        return void this.sendEvent(API_EVENT.CURSOR_CLICK);
                    case 'rightClick':
                        return void this.sendEvent(API_EVENT.CURSOR_RIGHT_CLICK);
                    case 'up':
                        return void this.sendEvent(API_EVENT.KEYBOARD_UP);
                    case 'left':
                        return void this.sendEvent(API_EVENT.KEYBOARD_LEFT);
                    case 'ok':
                        return void this.sendEvent(API_EVENT.KEYBOARD_OK);
                    case 'right':
                        return void this.sendEvent(API_EVENT.KEYBOARD_RIGHT);
                    case 'back':
                        return void this.sendEvent(API_EVENT.KEYBOARD_BACK);
                    case 'down':
                        return void this.sendEvent(API_EVENT.KEYBOARD_DOWN);
                    case 'menu':
                        return void this.sendEvent(API_EVENT.KEYBOARD_MENU);
                    case 'play':
                        return void this.sendEvent(API_EVENT.KEYBOARD_PLAY);
                    case 'pause':
                        return void this.sendEvent(API_EVENT.KEYBOARD_PAUSE);
                    case 'stop':
                        return void this.sendEvent(API_EVENT.KEYBOARD_STOP);
                }
            };
            this.bindEvents();
        }
        bindEvents() {
            const $area = document.querySelector('.area__touch');
            $area.addEventListener('mousedown', this.handlerAreaPressStart, { passive: false });
            $area.addEventListener('touchstart', this.handlerAreaPressStart, { passive: false });
            document.addEventListener('mouseup', this.handlerAreaPressEnd, { passive: false });
            document.addEventListener('touchend', this.handlerAreaPressEnd, { passive: false });
            document.addEventListener('mousemove', this.handlerAreaPressMove, { passive: false });
            document.addEventListener('touchmove', this.handlerAreaPressMove, { passive: false });
            document.addEventListener('click', this.preventEvent, { passive: false });
            document.addEventListener('mousemove', this.preventEvent, { passive: false });
            document.addEventListener('touchmove', this.preventEvent, { passive: false });
            document.querySelectorAll('[data-button]').forEach(button => {
                button.addEventListener('click', this.handlerButtonClick);
            });
        }
        preventEvent(event) {
            event.preventDefault();
        }
        getPoint(event) {
            if (event.touches) {
                return [event.touches[0].pageX, event.touches[0].pageY];
            }
            return [event.pageX, event.pageY];
        }
        async sendEvent(eventName, ...args) {
            this.sendQueue.push({
                eventName,
                args,
            });
            this.sendNext().then(() => { });
        }
        async sendNext() {
            if (this.sending) {
                return;
            }
            if (!this.sendQueue.length) {
                return;
            }
            const data = this.sendQueue.shift();
            try {
                await fetch('/api', {
                    method: 'POST',
                    body: JSON.stringify(data),
                    cache: 'no-cache',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            }
            catch (e) { }
            this.sendNext().then(() => { });
        }
    })();
    function call(fn, ...args) {
        return fn(...args);
    }
})();
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
})(API_EVENT || (API_EVENT = {}));
