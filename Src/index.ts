import { app, BrowserWindow, Menu, Tray, ipcMain } from 'electron';
import { API_EVENT, eventHandler } from './eventHandler';
import { fromClient, fromRoot } from './resolve';

var ip = require('ip');

const INDEX_FILE = fromClient('index.html');
const TRAY_ICON = fromClient('images', 'icon.png');

/*try {
	require('electron-reload')(fromClient('**', '*.js'), {
		electron: fromRoot('node_modules', '.bin', 'electron'),
	});
} catch (e) {}*/

let tray: Tray;

function createWindow() {
	tray = new Tray(TRAY_ICON);
	const contextMenu = Menu.buildFromTemplate([
		{
			label: 'Показать/скрыть',
			type: 'normal',
			click: () => {
				if (win.isVisible()) {
					win.hide();
				} else {
					win.show();
				}
			},
		},
		{
			label: 'Закрыть',
			type: 'normal',
			click: () => {
				app.exit(0);
			},
		},
	]);
	tray.setToolTip(`PC Remote Control [${ip.address()}]`);
	tray.setContextMenu(contextMenu);
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
		},
		minimizable: true,
		show: false,
	});
	win.hide();

	win.loadFile(INDEX_FILE);
	/*win.webContents.executeJavaScript(`
    var path = require('path');
    module.paths.push(path.resolve('node_modules'));
    module.paths.push(path.resolve('../node_modules'));
    module.paths.push(path.resolve(__dirname, '..', '..', 'electron', 'node_modules'));
    module.paths.push(path.resolve(__dirname, '..', '..', 'electron.asar', 'node_modules'));
    module.paths.push(path.resolve(__dirname, '..', '..', 'app', 'node_modules'));
    module.paths.push(path.resolve(__dirname, '..', '..', 'app.asar', 'node_modules'));
    path = undefined;
  `);*/

	ipcMain.on('api', (event, dataStr) => {
		const data = JSON.parse(dataStr) as IApi;
		eventHandler(data.eventName, data.args);
	});
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

interface IApi {
	eventName: API_EVENT;
	args: any[];
}
