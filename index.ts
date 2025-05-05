import http from 'node:http';
import { app } from './src/app';
import { config } from './src/infrastructure/config/config';

// Importing the app and config modules
const server = http.createServer(app);

// Importing the server and config modules
const HOST = config.server.host;
const PORT = config.server.port;

// Starting the server
server.listen(PORT, () => {
	console.log(`Server is running on http://${HOST}:${PORT}.`);
});
