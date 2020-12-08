"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const eventHandler_1 = require("./eventHandler");
const resolve_1 = require("./resolve");
var ip = require('ip');
const INDEX_FILE = resolve_1.fromClient('index.html');
const TRAY_ICON = resolve_1.fromClient('images', 'icon.png');
require('electron-reload')(resolve_1.fromClient('**', '*.js'), {
    electron: resolve_1.fromRoot('node_modules', '.bin', 'electron'),
});
let tray;
function createWindow() {
    tray = new electron_1.Tray(TRAY_ICON);
    const contextMenu = electron_1.Menu.buildFromTemplate([
        {
            label: 'Показать/скрыть',
            type: 'normal',
            click: () => {
                if (win.isVisible()) {
                    win.hide();
                }
                else {
                    win.show();
                }
            },
        },
        {
            label: 'Закрыть',
            type: 'normal',
            click: () => {
                electron_1.app.exit(0);
            },
        },
    ]);
    tray.setToolTip(`PC Remote Control [${ip.address()}]`);
    tray.setContextMenu(contextMenu);
    const win = new electron_1.BrowserWindow({
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
    electron_1.ipcMain.on('api', (event, dataStr) => {
        const data = JSON.parse(dataStr);
        eventHandler_1.eventHandler(data.eventName, data.args);
    });
}
electron_1.app.whenReady().then(createWindow);
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
