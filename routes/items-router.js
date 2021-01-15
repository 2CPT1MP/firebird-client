const Express = require('express');
const itemsRouter = Express.Router();

const dbConnection = require('../firebird-controller').Connection;


function getAllItems(callback) {
  dbConnection.query('SELECT * FROM menu_item;', (error, result) => {
    if (error) throw error;

    let menuItems = [];
    result.fetch("all", true, (row) => {
      let menuItem = {
        id: row.ID,
        title: row.TITLE,
        price: row.PRICE,
        description: 'with id ' + row.ID,
        picUrl: 'imgs/dish.svg'
      };
      menuItems.push(menuItem);
    }, (err, eof) => {
      if (err) throw err;

      callback(menuItems);
    });
  });
}



itemsRouter.get('/', (req, res) => {
  const DEFAULT_PIC_URL = 'imgs/dish.svg';

  getAllItems( (items) => {
    res.render('items', {menuItems: items})
  });

})

module.exports = itemsRouter;