"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const electron_1 = require("electron");
const resolve_1 = require("../resolve");
const app = express_1.default();
const port = 80;
const jsonParser = body_parser_1.default.json();
app.use('/', express_1.default.static(resolve_1.fromClient('public')));
app.post('/api', jsonParser, (req, res) => {
    const body = req.body;
    res.json({ status: 'ok' });
    electron_1.ipcRenderer.send('api', JSON.stringify(body));
});
app.all('*', (req, res) => {
    res.sendFile(resolve_1.fromClient('public', 'index.html'));
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
