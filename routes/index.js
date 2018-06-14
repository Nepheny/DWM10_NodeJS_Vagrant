const express = require('express');
const router = express.Router();
const scrapping = require('../helpers/scrapping.js');

// GET CREATE in the dB
router.get('/create', function(req, res, next) {
  scrapping.champions.scrapDB(function (result) {
      console.log('here');
      res.render('home', { "champions": result });
  });
});

// GET READ on home page


// GET UPDATE in the DB


// GET DELETE in the DB


// GET home page
router.get('/', function(req, res, next) {
  let champions = scrapping.read('champions');
  res.render('home', { "champions": champions });
});

// POST single champion
router.post("/champion/scrap", function(req, res, next) {
  let url = req.body.url;
  scrapping.champion.scrap(url, function (result) {
    res.send(result);
  });
});

// GET refreshed home page
router.get('/champions/scrap', function(req, res, next) {
  scrapping.champions.scrap(function () {
    res.send('true');
  });
});

module.exports = router;