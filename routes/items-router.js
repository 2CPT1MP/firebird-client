const Express = require('express');
const BodyParser = require('body-parser');
const itemsRouter = Express.Router();

const MenuItems = require('../models/MenuItems');
const jsonParser = BodyParser.json();

itemsRouter.get('/', async(req, res) => {
  const items = await MenuItems.getAll();
  res.render('items', {menuItems: items})
});

itemsRouter.post('/api/shopping-card-items',  jsonParser, async(req, res) => {
  const items = await MenuItems.getByIds(req.body.ids);
  res.contentType('application/json');
  res.send(JSON.stringify(items));
});

module.exports = itemsRouter;