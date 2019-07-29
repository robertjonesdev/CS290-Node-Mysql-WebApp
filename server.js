//Robert Jones - Activity Tracker

var express = require('express');
var mysql = require('./dbcon.js');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('port', 7797);

//https://enable-cors.org/server_expressjs.html
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Create Table
app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    mysql.pool.query(createString, function(err){
      res.send("Table Reset Complete.");
    })
  });
});

// CRUD Design Pattern: Create Read Update Delete

/****************************
*         CREATE / INSERT
*****************************/
app.post('/add', function(req, res, next){
   if (req.body['request'] == "insert") {
      var pParams = [];
      if (req.body['name'] == '') {
          res.status(500).send({ error: "Empty name field." });
      } else {
      pParams.push(req.body['name']);
      pParams.push(Number(req.body['reps']));
      pParams.push(Number(req.body['weight']));
      pParams.push(req.body['date']);
      pParams.push(Number(req.body['lbs']));
      console.log(pParams);
      mysql.pool.query("INSERT INTO workouts (name, reps, weight, date, lbs) VALUES (?)", [pParams], function(err, result, fields){
          if(err) throw err;
          console.log("Number of records inserted: " + result.affectedRows + " with id " + result.insertId);
          mysql.pool.query('SELECT * FROM workouts WHERE id =' + result.insertId, function(err, rows, fields){
            if(err){
              next(err);
              return;
            }
            res.send(JSON.stringify(rows));
          });
      });
    }
  }
});

/*******************************************
*       READ / SELECT for Initial Pageload
*********************************************/
app.get('/',function(req,res,next){
    var context = {};
    mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
      if(err){
        next(err);
        return;
      }
    res.send(JSON.stringify(rows));
    });
});

/****************************
*         DELETE
*****************************/
app.post('/delete', function(req, res, next){
  if (req.body['request'] == "delete") {
      console.log("delete " + req.body['id']);
      mysql.pool.query('DELETE FROM workouts WHERE id=? ',[req.body['id']], function(err, result) {
          if (err) throw err;
          console.log("Number of records deleted: " + result.affectedRows);
          res.send(JSON.stringify(req.body['id']));
      });

  }
});

/****************************
*         UPDATE / EDIT
*****************************/
app.post('/edit', function(req, res, next){
   if (req.body['request'] == 'edit') {
      console.log("Edit request for ID #: " + req.body['id']);
      if (req.body['name'] == '') {
          res.status(500).send({ error: "Empty name field." });
      } else {
      mysql.pool.query("SELECT * FROM workouts WHERE id=?", [Number(req.body['id'])], function(err, result){
        if(err){
          next(err);
          return;
        }
        console.log("Results affected: " + result.length);
        if (result.length == 1) {
          var curVals = result[0];
          let sql = "UPDATE workouts SET name = ?, reps = ?, weight = ?, date = ?, lbs = ? WHERE id = ?";
          let data =  [req.body['name'] || curVals.name, Number(req.body['reps']) || Number(curVals.reps), Number(req.body['weight']) ||
                Number(curVals.weight), req.body['date'] || curVals.date, Number(req.body['lbs']), Number(req.body['id'])];
          mysql.pool.query(sql,data, function(err, result, fields){
                if(err){
                  next(err);
                  return;
                }
            mysql.pool.query('SELECT * FROM workouts WHERE id =' + req.body['id'], function(err, rows, fields){
              if(err){
                next(err);
                return;
              }
              res.send(JSON.stringify(rows));
            });
          });
        } else {
            console.log("Edit error");
        }
      });
     }
 }
 });

/****************************
*   SQL Connection Status
*****************************/
mysql.pool.getConnection(function(err) {
  if (err) throw err;
  console.log("MySQL Connected!");
});

/****************************
*   Node Server Start Status
*****************************/
app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
