import express from 'express';
import bodyParser from 'body-parser';
import { ipcRenderer } from 'electron';
import { fromClient } from '../resolve';

const app = express();
const port = 80;

const jsonParser = bodyParser.json();

app.use('/', express.static(fromClient('public')));

app.post('/api', jsonParser, (req, res) => {
	const body = req.body as any;
	res.json({ status: 'ok' });
	ipcRenderer.send('api', JSON.stringify(body));
});

app.all('*', (req, res) => {
	res.sendFile(fromClient('public', 'index.html'));
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
