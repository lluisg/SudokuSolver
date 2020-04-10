const express = require('express');
var mysql = require('mysql');
var socket = require('socket.io');
const app = express();
var _ = require('underscore');

//to use the database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'lluis12',
  database: 'web_maria'
});

var server = app.listen(3000,() => console.log('listening at 3000'));
app.use(express.static(__dirname + '/public'));
app.use(express.json());
var io = socket(server)
//other port to handle various exercicies at the same time with server
var serverLetterGame = app.listen(3005,() => console.log('listening at 3005'));
var ioLetterGame = socket(serverLetterGame)


db.connect(function(err) { //CONECTIONG DATABASE
  if (err) throw err;
  console.log("DB Connected!");
});

var sql;
app.get('/getDB/:sql', async (request, response) => {
  console.log('request parameters',request.params);
  const sqlquery = request.params.sql;
  db.query(sqlquery, function(err, rows) { //MAKE A QUERY
      if (err){
        response.end();
        console.log('Error while performing Query.', err);
        return;
      }
      response.json({rows});
      console.log('The query result is: ', rows);

  });
});

// app.post('/api', async (request, response) => {
//   console.log('I got a request!');
//   console.log(request.body);
//   response.json({
//       status:'success',
//       latitude: request.body.lat,
//       longitude: request.body.lon
//   });
// });

app.post('/checkUsr', async (request, response) => {
  //returns if the user is in the database or not
  console.log('I got a request!');
  console.log(request.body.sql);

  db.query(request.body.sql, function(err, rows) { //MAKE A QUERY
      if (err){
        response.end();
        console.log('Error while performing Query.', err);
        return;
      }
      // response.json({rows});
      console.log('The query result is: ', rows);
      if(rows.length==0){
        response.json({
          status:'wrong'
        });
      }else{
        response.json({
          status:'succes'
        });
      }
  });
});
