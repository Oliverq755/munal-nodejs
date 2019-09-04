// this is needed for importing expressjs into our application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const appConfig = require('./config/appConfig');
const fs = require('fs');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
// aws server configuration
const aws = require('aws-sdk');


var helmet = require('helmet');
const logger = require('./lib/loggerLib');


//declaring an instance or creating an application instance
const app = express()

app.use(cookieParser())

app.use(helmet())

app.use(bodyParser.json());


// Enabling CORS
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authToken");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    next();
});



// Bootstrap models
let modelsPath = './models'
fs.readdirSync(modelsPath).forEach(function (file) {
    if (~file.indexOf('.js')) {
        // console.log(file)
        require(modelsPath + '/' + file)
    }
})
// end Bootstrap models


// Bootstrap route
let routesPath = './routes'
fs.readdirSync(routesPath).forEach(function (file) {
    if (~file.indexOf('.js')) {
        // console.log("including the following file");
        // console.log(routesPath + '/' + file)
        let route = require(routesPath + '/' + file);
        route.setRouter(app);
    }
});
// end bootstrap route



/**
 * Create HTTP server.
 */

const server = http.createServer(app)
// start listening to http server
// console.log(appConfig)
server.listen(appConfig.port);
server.on('error', onError);
server.on('listening', onListening);
server.on('listening', s3AWSBucketObjects);

// end server listening code

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        logger.error(error.code + ' not equal listen', 'serverOnErrorHandler', 10)
        throw error
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            logger.error(error.code + ':elavated privileges required', 'serverOnErrorHandler', 10)
            process.exit(1)
            break
        case 'EADDRINUSE':
            logger.error(error.code + ':port is already in use.', 'serverOnErrorHandler', 10)
            process.exit(1)
            break
        default:
            logger.error(error.code + ':some unknown error occured', 'serverOnErrorHandler', 10)
            throw error
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address()
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    ('Listening on ' + bind)
    logger.info('server listening on port ' + addr.port, 'serverOnListeningHandler', 10)
    let db = mongoose.connect(appConfig.db.uri, { useNewUrlParser: true, useCreateIndex: true })
}

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
    // application specific logging, throwing an error, or other logic here
})


// handling mongoose connection error
mongoose.connection.on('error', function (err) {
    console.log('database connection error');
    console.log(err)

}); // end mongoose connection error

// handling mongoose success event
mongoose.connection.on('open', function (err) {
    if (err) {
        console.log("database error");
        console.log(err);

    } else {
        console.log("database connection open success");
    }

}); // end mongoose connection open handler

function s3AWSBucketObjects() {
    aws.config.update({
        accessKeyId: appConfig.aws.accessKey,
        secretAccessKey: appConfig.aws.secretKey,
        region: appConfig.aws.regionName
    });
    
    let s3 = new aws.S3();
    let params = {
        Bucket: appConfig.aws.bucketName
    };
    s3.listObjectsV2(params, function (err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log("Successfully uploaded data to myBucket/myKey", res);
        }
    });

}