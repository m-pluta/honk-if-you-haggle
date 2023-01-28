// Import main JS app code
const app = require('./app.js');

// Server params
const hostname = '127.0.0.1';
const port = 8080;

// Open connection on specific port
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
