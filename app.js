//module dependency
const proxy = require('http-proxy');
const express=require('express');
const path=require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const logger = require('./webserver/config/appconfig.js');
//including environment value using config
const config = require('./webserver/config/');
let navItems = require('./webserver/navbar/navigateRouter.js');

let authRoutes = require('./webserver/auth/authrouter');
let authByToken = require('./webserver/auth/authbytoken');
  
function createApp() {
	const app = express();

  return app;
}

function setupStaticRoutes(app) {
  app.use(express.static(path.join(__dirname, 'webapp')));
	app.use(express.static(path.join(__dirname, 'bower_components')));

  return app;
}

function setupMiddlewares(app) {
  app.use(cookieParser());
	app.use(morgan('dev'));
  return app;
}

function setupMongooseConnections() {
  mongoose.connect(config.MONGO_URL);

  mongoose.connection.on('connected', function() {
   /* logger.debug('Mongoose is now connected to ', config.MONGO_URL);*/
  });

  mongoose.connection.on('error', function(err) {
/*    logger.error('Error in Mongoose connection: ', err);
*/  });

  mongoose.connection.on('disconnected', function() {
/*    logger.debug('Mongoose is now disconnected..!');
*/  });

  process.on('SIGINT', function() {
    mongoose.connection.close(function() {
      /*logger.info(
        'Mongoose disconnected on process termination'
      );*/
      process.exit(0);
    });
  });
}


function setupRestRoutes(app) {
  app.use('/', authRoutes);
  app.use('/', navItems);
  app.use('/', function(req, res) {

    let options = {
      target: {
        host: 'localhost',
        port: 8081
      }
    };
    platformProxy.web(req, res, options);
  });

  platformProxy.on('error', function(err, req, res) {
    console.error('Error in proxy pass: ', err);
  });
    return app;
};

let port = process.env.PORT || 8080;
let platformProxy = proxy.createProxyServer();

module.exports = function() {
  
  let app = createApp();

  app = setupStaticRoutes(app);


  app = setupMiddlewares(app);

  app = setupRestRoutes(app);
  app.onAppStart = function(addr) {
    console.error('Samarth-Candidateprofile web app is now Running on port:', addr.port);
};
  setupMongooseConnections();

  return app;
};