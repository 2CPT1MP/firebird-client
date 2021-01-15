const Express = require('express');
const BodyParser = require('body-parser');
const itemsRouter = Express.Router();
const dbConnection = require('../firebird-controller').Connection;

const jsonParser = BodyParser.json();


function getAllItems(callback, query='SELECT * FROM menu_item;') {
  dbConnection.query(query, (error, result) => {
    if (error) throw error;

    let menuItems = [];
    result.fetch("all", true, (row) => {
      let menuItem = {
        id: row.ID,
        title: row.TITLE,
        price: row.PRICE,
        description: 'Для покупки нажмите на кнопку "Добавить в корзину"',
        picUrl: 'imgs/dish.svg'
      };
      menuItems.push(menuItem);
    }, (err, eof) => {
      if (err) throw err;

      callback(menuItems);
    });
  });
}

// PROTECT FROM SQL INJECTION!!!
function getItemsById(ids, callback) {
  let query = `SELECT * FROM menu_item WHERE id IN (${ids.join(', ')});`;
  getAllItems((menuItems) => callback(menuItems), query);
}

itemsRouter.get('/', (req, res) => {
  getAllItems( (items) => {
    res.render('items', {menuItems: items})
  });
})

// PROTECT FROM SQL INJECTION!!!
itemsRouter.post('/api/shopping-card-items',  jsonParser, (req, res) => {
  getItemsById(req.body.ids, (menuItems) => {
    res.contentType('application/json');
    res.send(JSON.stringify(menuItems));
  });
});


module.exports = itemsRouter;