const Express = require('express');
const BodyParser = require('body-parser');
const ordersRouter = Express.Router();
const jsonParser = BodyParser.json();

const dbConnection = require('../firebird-connection');
const Order = require('../models/Order');
const Client = require('../models/Client');
const Delivery = require('../models/Delivery');
const OrderDetails = require('../models/OrderDetails');


ordersRouter.put('/',  jsonParser, async(req, res) => {
  const clientData = req.body.clientData;
  const itemMap = req.body.itemQuantityMap;

  const client = new Client(Math.floor(Math.random()*1000000), clientData.firstNameInput, clientData.lastNameInput, clientData.middleNameInput);
  const delivery = new Delivery(Math.floor(Math.random()*1000000), 'delivery', clientData.addressInput);
  const order = new Order(Math.floor(Math.random()*1000000), "pending", null, delivery, client);
  const orderDetails = new OrderDetails(itemMap, order.id);

  await client.save();
  await delivery.save();
  await order.save();
  await orderDetails.save();

  dbConnection.commit((err) => {
    if (err) throw err;
    res.send('{"status":"ok"}');
  });
});

ordersRouter.get('/', async(req, res) => {
  const orders = await Order.getAll();
  res.render('orders', {orders});
});

ordersRouter.get('/:id', async (req, res) => {
  let promise = await OrderDetails.getByOrderId(1);
});

module.exports = ordersRouter;