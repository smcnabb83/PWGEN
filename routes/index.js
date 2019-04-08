var express = require('express');
var router = express.Router();

/* GET home page. */
var rand = function (max) {
  return Math.floor(Math.random() * max);
}

var appendDigits = function (string) {
  var trail = rand(Math.pow(10, (10 - string.toString().length)) - 1);
  return string[0].toUpperCase() + string.substr(1) + trail;
}

router.get('/', function (req, res, next) {
  var sql = require('mssql/msnodesqlv8');
  var indexMax = null;
  var wordRetrieved = null;

  //TODO: Move this into a config file.
  var config = {
    driver: 'msnodesqlv8',
    server: '',
    database: '',
    options: {
      trustedConnection: true
    }
  };


  sql.connect(config, function (err) {
    if (err) {
      if (err.code == 'ELOGIN') {
        res.render("You do not have permission to access this database");
        sql.close();
      } else {
        res.render("Miscellaneous errors: " + err.code.toString() + " " + err.message.toString());
        sql.close();
      }
    }
    var request = new sql.Request();
    //TODO: Refactor to avoid excessive callbacks.
    request.query('SELECT MAX([index]) as i FROM dbo.WordList WHERE word IS NOT NULL', function (err, recordset) {
      if (err) {
        console.log(err.name, err.code, err.message);
        res.render("Query error: " + err.code.toString + " " + err.message.toString());
        sql.close();
      } else {
        indexMax = recordset['recordset'][0]['i'];
        var request2 = new sql.Request();
        request2.query('SELECT word FROM dbo.WordList WHERE [index] = ' + rand(indexMax), function (err, recordset) {
          if (err) {
            console.log(err.name, err.code, err.message);
            res.render("Query error: " + err.code.toString + " " + err.message.toString());
            sql.close();
          } else {
            wordRetrieved = recordset['recordset'][0]['word'];
            res.render('index', {
              title: appendDigits(wordRetrieved)
            });
            sql.close();
          }
        })

      }
    });
  })
});

module.exports = router;