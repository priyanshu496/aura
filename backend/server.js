import 'dotenv/config';
import http from 'http';
import App from './app.js';

const PORT = process.env.PORT || 3000;

const server = http.createServer(App);

server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})