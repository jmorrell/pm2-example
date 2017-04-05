var pm2 = require('pm2');

var instances = process.env.WEB_CONCURRENCY || -1;
var maxMemory = process.env.WEB_MEMORY || 512;

pm2.connect(function() {
  var option = {
    name: 'pm2-testing',
    script: 'app.js',
    exec_mode: 'cluster',
    instances: env == 'local'? 1 : instances,
    max_memory_restart : maxMemory + 'M',
  };

  pm2.start(option, function(err) {
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
