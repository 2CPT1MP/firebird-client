/**
 * Importing required modules
 * */
const Express = require('express');
const Firebird = require('firebird');
const itemsRouter = require('./routes/items-router')


/**
 * Initializing constants / variables
 * */
const PORT = process.env.PORT || 5000;
const app = Express();


/**
 *  Application script
 * */
app.use(Express.static('./public'));
app.set('view engine', 'ejs');

app.use('/', itemsRouter);

// Setup DB connection

app.listen(PORT);

/*
dbConnection.query('SELECT * FROM client;', (err, result) => {
  if (err) throw err;
  else console.log(result.fetchSync("all", true));*/