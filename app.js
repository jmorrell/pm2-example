var express = require('express');
var app = express();
var port = process.env.PORT || 5000;
app.get('/', (req, res) => res.send('Hello World!'));

// Wait a full second before logging so that we can be sure
// that pm2 is listening and not swallowing logs
setTimeout(() => {
  console.log(Math.random());
  app.listen(port, () => console.log(`Listening on port: ${port}!`));
}, 1000);
