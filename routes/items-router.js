const Express = require('express');
const itemsRouter = Express.Router();

const dbConnection = require('../firebird-controller').Connection;

class MenuItem {
  constructor(id, title, price) {
    this.id = id;
    this.title = title;
    this.price = price;
  }
}


function getAllItems() {
  let menuItems = [];

  dbConnection.query('SELECT * FROM menu_item;', (error, result) => {
    if (error) throw error;

    menuItems = result.fetch("all", true, (row) => {

      //var menuItem = new MenuItem(row.ID, row.TITLE, row.PRICE);

      let obj = {
        title: 1,
        id: "wdwd"
      }

      /*
      var menuItem = {
        id: row.ID,
        title: row.TITLE,
        price: row.PRICE
      }*/

      //console.log(menuItem);
      //menuItems.push(menuItem);
      menuItems.push(obj);

    }, (err, eof) => {

    });


  });
}



itemsRouter.get('/', (req, res) => {
  const DEFAULT_PIC_URL = 'imgs/dish.svg';

  getAllItems();
  /*
  let menuItems = [
    {id: 0, title: 'first', description: '1-st', price: 0.0, picUrl: DEFAULT_PIC_URL },
    {id: 1, title: 'second', description: '2-nd', price: 0.0, picUrl: DEFAULT_PIC_URL },
    {id: 2, title: 'third', description: '3-rd', price: 0.0, picUrl: DEFAULT_PIC_URL },
    {id: 3, title: 'fourth', description: '4-th', price: 0.0, picUrl: DEFAULT_PIC_URL },
  ];
*/


  //res.render('items', {menuItems: menuItems});
})

module.exports = itemsRouter;