const IS_DEV = process.env.NODE_ENV == 'dev';


if (IS_DEV)
  require('./server/app.js');
else
  require('./server/cluster.js');

