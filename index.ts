import http from 'http';
import { app } from './src/app';

const port = 3000;

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});