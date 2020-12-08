(function () {
	const app = new (class Application {
		public isAreaPressed = false;
		public lastCursorPosition = [0, 0];
		public sendQueue: Array<IApi> = [];
		public sending = false;

		constructor() {
			this.bindEvents();
		}
		public bindEvents() {
			const $area = document.querySelector('.area__touch') as HTMLDivElement;
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

		public preventEvent(event: Event) {
			event.preventDefault();
		}
		public handlerAreaPressStart = (event: MouseEvent | TouchEvent) => {
			this.isAreaPressed = true;
			this.lastCursorPosition = this.getPoint(event);
		};
		public handlerAreaPressEnd = (event: MouseEvent | TouchEvent) => {
			this.isAreaPressed = false;
		};
		public handlerAreaPressMove = (event: MouseEvent | TouchEvent) => {
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
		public handlerAreaClick = () => {
			void this.sendEvent(API_EVENT.CURSOR_CLICK);
		};
		public handlerButtonClick = (event: Event) => {
			window.navigator.vibrate(50);
			const target = event.target as HTMLButtonElement;
			const type = target.getAttribute('data-button') as string;
			switch (type) {
				case 'switch':
					const $area = document.querySelector('.area') as HTMLDivElement;
					const type = $area.getAttribute('data-type') as string;
					const nextType: any = {
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

		public getPoint(event: MouseEvent | TouchEvent): [number, number] {
			if ((event as TouchEvent).touches) {
				return [(event as TouchEvent).touches[0].pageX, (event as TouchEvent).touches[0].pageY];
			}
			return [(event as MouseEvent).pageX, (event as MouseEvent).pageY];
		}

		public async sendEvent(eventName: API_EVENT, ...args: any[]) {
			this.sendQueue.push({
				eventName,
				args,
			});
			this.sendNext().then(() => {});
		}
		public async sendNext() {
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
			} catch (e) {}
			this.sendNext().then(() => {});
		}
	})();

	function call<TArgs extends any[], TResult>(fn: (...args: TArgs) => TResult, ...args: TArgs): TResult {
		return fn(...args);
	}
})();

interface IApi {
	eventName: API_EVENT;
	args: any[];
}

enum API_EVENT {
	UNKNOWN,
	CURSOR_MOVE,
	CURSOR_CLICK,
	CURSOR_RIGHT_CLICK,
	KEYBOARD_UP,
	KEYBOARD_DOWN,
	KEYBOARD_LEFT,
	KEYBOARD_RIGHT,
	KEYBOARD_BACK,
	KEYBOARD_OK,
	KEYBOARD_MENU,
	KEYBOARD_PLAY,
	KEYBOARD_PAUSE,
	KEYBOARD_STOP,
}
