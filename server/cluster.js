const cluster = require('cluster');
const os = require('os');


if(cluster.isMaster) {
  const NUM_CORES = os.cpus().length;

  console.log(`cpu count: ${NUM_CORES}`);
  for(let i = 0; i < NUM_CORES; i++){
    cluster.fork();
  }
} else {
  require('./app.js');
}
