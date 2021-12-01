const server = require('./app');

const port = process.env.PORT || 3000;

if (require.main === module) {
    server.listen(port, () => console.log(`Server running on port ${port}`));
}

module.exports = server;