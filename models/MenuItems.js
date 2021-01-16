const dbConnection = require('../firebird-controller').Connection;

class MenuItem {
  static DEFAULT_DESC = 'Для покупки нажмите на кнопку "Добавить в корзину"';
  static DEFAULT_PIC_URL = 'imgs/dish.svg';

  constructor(id, title, price,
              description = MenuItem.DEFAULT_DESC,
              picUrl = MenuItem.DEFAULT_PIC_URL)
  {
    this.id = id;
    this.title = title;
    this.price = price;
    this.description = description;
    this.picUrl = picUrl;
  }
}

function getAllItems(callback, query='SELECT * FROM menu_item;') {
  dbConnection.query(query, (error, result) => {
    if (error)
      throw error;

    let menuItems = [];
    result.fetch("all", true, (row) => {
      let menuItem = new MenuItem(row.ID, row.TITLE, row.PRICE);
      menuItems.push(menuItem);
    }, (err, eof) => {
      if (err)
        throw err;
      callback(menuItems);
    });
  });
}

function getItemsById(ids, callback) {
  let query = `SELECT * FROM menu_item WHERE id IN (${ids.join(', ')});`;
  getAllItems((menuItems) => callback(menuItems), query);
}

module.exports.MenuItem = MenuItem;
module.exports.getAll = getAllItems;
module.exports.getByIds = getItemsById;