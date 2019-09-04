const express = require('express');
const router =express.Router();
const musicController = require('../controllers/musics.controller');
const appConfig = require('../config/appConfig');
const auth = require('../middleware/auth');

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/musics`;

    // Defining Routes

    app.get(baseUrl + '/hello', musicController.helloWorldFunc);

    app.post(`${baseUrl}/`, musicController.addMusicsFunction);

    app.get(`${baseUrl}/`, musicController.addMusicsFunction);

    // app.post(`${baseUrl}/login`, userController.loginFunction);
   
}

