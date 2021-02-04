const dbConnection = require('../firebird-controller').Connection;

class MenuItem {
  static DEFAULT_DESC = 'Для покупки нажмите на кнопку "Добавить в корзину"';
  static DEFAULT_PIC_URL = 'imgs/dish.svg';

  constructor(id, title, price, amount=1,
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

async function getAllItems(query='SELECT * FROM menu_item;') {
  return new Promise(((resolve, reject) => {
    dbConnection.query(query, (error, result) => {
      if (error) reject(error);

      let menuItems = [];
      result.fetch("all", true, (row) => {
        let menuItem = new MenuItem(row.ID, row.TITLE, row.PRICE);
        menuItems.push(menuItem);
      }, (err, eof) => {
        if (err) reject(err);
        resolve(menuItems);
      });
    });
  }));
}

async function getItemsById(ids) {
  return new Promise((async(resolve, reject) => {
    let query = `SELECT * FROM menu_item WHERE id IN (${ids.join(', ')});`;
    const items = await getAllItems(query);
    resolve(items);
  }));
}

module.exports.MenuItem = MenuItem;
module.exports.getAll = getAllItems;
module.exports.getByIds = getItemsById;