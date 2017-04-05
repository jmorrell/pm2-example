var pm2 = require('pm2');

var instances = process.env.WEB_CONCURRENCY || -1;
var maxMemory = process.env.WEB_MEMORY || 512;

// Set instances to 10 to check that we're starting enough processes
instances = 10;
console.log(`Starting server with ${instances} instances.`);
console.log(`You should see ${instances} random numbers logged.`);

var options = {
  name: 'pm2-testing',
  script: 'app.js',
  exec_mode: 'cluster',
  instances: instances,
  max_memory_restart : `${maxMemory}M`,
};

pm2.connect((err) => {
  if (err) {
    console.error(err);
    process.exit(2);
  }

  pm2.start(options, (err) => {
    if (err) return console.error('Error while launching applications', err.stack || err);
    console.log('PM2 and application has been succesfully started');

    // Display logs in standard output
    pm2.launchBus(function(err, bus) {
      console.log('[PM2] Log streaming started');

      bus.on('log:out', function(packet) {
       console.log('[App:%s] %s', packet.process.name, packet.data);
      });

      bus.on('log:err', function(packet) {
        console.error('[App:%s][Err] %s', packet.process.name, packet.data);
      });
    });
  });
});
