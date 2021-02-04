const Express = require('express');
const BodyParser = require('body-parser');
const ordersRouter = Express.Router();
const dbConnection = require('../firebird-controller').Connection;

const Orders = require('../models/Orders');
const Client = require('../models/Client');
const Delivery = require('../models/Delivery');
const OrderDetails = require('../models/OrderDetails');

const jsonParser = BodyParser.json();

ordersRouter.put('/',  jsonParser, (req, res) => {
  const clientData = req.body.clientData;
  const itemMap = req.body.itemQuantityMap;

  const client = new Client(Math.floor(Math.random()*1000000), clientData.firstNameInput, clientData.lastNameInput, clientData.middleNameInput);
  const delivery = new Delivery(Math.floor(Math.random()*1000000), 'delivery', clientData.addressInput);
  const order = new Orders.Order(Math.floor(Math.random()*1000000), "pending", '2021-02-04 20:30', delivery, client);
  const orderDetails = new OrderDetails(itemMap, order.id);

  client.save(() => delivery.save(() => order.save(() => orderDetails.save(() => {
    dbConnection.commit((err) => {
      if (err) throw err;
      res.send('{"status":"ok"}');
    });
  }))));

});

ordersRouter.get('/', (req, res) => {
  Orders.getAll((orders) => {
    res.render('orders', {orders});
  })
});

module.exports = ordersRouter;