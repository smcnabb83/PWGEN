var express = require('express');
var router = express.Router();
var fs = require('fs');
var csv = require('csv-parser');

/* GET home page. */
var rand = function (max) {
  return Math.floor(Math.random() * max);
}

var appendDigits = function (string) {
  var trail = rand(Math.pow(10, (10 - string.toString().length)) - 1);
  return string[0].toUpperCase() + string.substr(1) + trail;
}

router.get('/', function (req, res, next) {
  var indexMax = null;
  var wordRetrieved = null;
  const results = [];
  fs.createReadStream('words.csv').pipe(csv()).on('data', (data) => results.push(data)).on('end', () =>{

    
    var passString = '';
    for(var i = 0; i < 5; i++){
      passString += results[rand(results.length)].word + (i === 4 ? '' : '-');
    }
    
    console.log(results[0].word);
    console.log(passString);
    res.render('index', {pass: passString});
  });

});

module.exports = router;