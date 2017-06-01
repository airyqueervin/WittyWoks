'use strict';
const express = require('express');
const router = express.Router();
const path = require('path'); // JC ADDED
const formidable = require('formidable'); // JEE ADDED
const fs = require('fs'); // JEE ADDED
const pdfParser = require('../pdfparse.js'); // BB ADDED
const keys = require('../../config/development.json'); // AE ADDED
const axios = require('axios'); // AE ADDED
const request = require('request'); // AE ADDED

router.route('/')
  .get((req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
  });

router.route('/dashboard')
  .get((req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
  });

router.route('/home')
  .get((req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
  });

router.route('/fileUpload')
  .post((req, res) => {
    var form = new formidable.IncomingForm();

    form.parse(req);
      
    form.uploadDir = path.join(__dirname, '../../uploads');

    form.on('file', function(field, file) {
      fs.rename(file.path, path.join(form.uploadDir, file.name));
      pdfParser.parsePDF(file.name, function(skills) {
        res.json(skills);
      });
    });

    form.on('error', function(err) {
      console.log('An error has occured: \n' + err);
    });  
  });

router.route('/glassDoor')
  .get((req, res) => {
    // console.log('REQ---', req.query.search);
    axios.get(`http://api.glassdoor.com/api/api.htm?v=1&format=json&t.p=${keys.glassDoor.PARTNER_ID}&t.k=${keys.glassDoor.API_KEY}&action=employers&q=${req.query.search}&userip=192.168.43.42&useragent=Mozilla/%2F4.0`)
      .then(result => {
        let data = result.data.response.employers;
        // console.log('Data from glassdoor', result.data.response.employers);
        res.status(200).send(data);
      })
      .catch(err => {
        console.error('Error occured getting data', err);
      });
  });

router.route('/indeed')
  .get((req, res) => {
    let location = req.query.location || 'San Francisco, CA';
    let jobOptions = {
      method: 'get',
      url: `https://indeed-indeed.p.mashape.com/apisearch?publisher=2321237742722632&callback=<required>&chnl=<required>&co=<required>&filter=<required>&format=json&fromage=<required>&highlight=<required>&jt=<required>&l=${location}&latlong=<required>&limit=<required>&q=${req.query.search}&radius=25&sort=<required>&st=<required>&start=<required>&useragent=<required>&userip=<required>&v=2`,
      headers: {
        'X-Mashape-Key': 'bJeQs4UvZFmsh84cu83JnIuzm4G8p1wjsRDjsncP8KbHtTSmdX',
        'Accept': 'application/json'
      }
    };
    request(jobOptions, (error, response, body) => {
      if (error) {
        console.error(error);
      } else {
        body = JSON.parse(body);
        res.send(body.results);
      }
    });
  });

module.exports = router;
