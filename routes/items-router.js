const Express = require('express');
const BodyParser = require('body-parser');
const itemsRouter = Express.Router();

const MenuItems = require('../models/MenuItems');
const jsonParser = BodyParser.json();

itemsRouter.get('/', (req, res) => {
  MenuItems.getAll( (items) => {
    res.render('items', {menuItems: items})
  });
});

itemsRouter.post('/api/shopping-card-items',  jsonParser, (req, res) => {
  MenuItems.getByIds(req.body.ids, (menuItems) => {
    res.contentType('application/json');
    res.send(JSON.stringify(menuItems));
  });
});

module.exports = itemsRouter;