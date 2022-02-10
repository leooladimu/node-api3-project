// require your server and launch it
const server = require('./api/server');
const port = 1984;

server.listen(port, () => {
  console.log(`\n*** Server Running on http://localhost:${port} ***\n`);
});
