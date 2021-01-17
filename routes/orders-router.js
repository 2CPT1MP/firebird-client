const Express = require('express');
const BodyParser = require('body-parser');
const ordersRouter = Express.Router();

const Orders = require('../models/Orders')
const jsonParser = BodyParser.json();

ordersRouter.put('/',  jsonParser, (req, res) => {
  console.log(req.body);
  res.send('{"status":"ok"}');
});

ordersRouter.get('/', (req, res) => {
  Orders.getAll((orders) => {
    res.render('orders', {orders});
  })
});

module.exports = ordersRouter;