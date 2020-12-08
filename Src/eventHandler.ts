import robot from 'robotjs';

export function eventHandler(event: API_EVENT, args: any[]) {
	switch (event) {
		case API_EVENT.CURSOR_MOVE:
			return void mouseMove(...(args as [number, number]));
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

function mouseMove(x: number, y: number) {
	const mousePos = robot.getMousePos();
	robot.moveMouse(mousePos.x + x, mousePos.y + y);
}

function mouseCLick(isRight = false) {
	if (isRight) {
		robot.mouseClick('right', false);
	} else {
		robot.mouseClick('left', false);
	}
}

function keyboardClick(key: string) {
	robot.keyTap(key);
}

export enum API_EVENT {
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
