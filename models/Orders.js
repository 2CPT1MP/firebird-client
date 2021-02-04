const dbConnection = require('../firebird-controller').Connection;
const Client = require('./Client');
const Delivery = require('./Delivery')


class Order {
  static DEFAULT_OPERATOR_ID = 0;

  constructor(id, status, time, delivery, client,
              operatorId = Order.DEFAULT_OPERATOR_ID) {
    this.id = id;
    this.status = status;
    this.time = time;
    this.delivery = delivery;
    this.client = client;
    this.operatorId = operatorId
  }

  async save() {
    return new Promise(((resolve, reject) => {
      const insertQuery = `INSERT INTO orders(id, status, delivery_id, client_id, operator_id) 
                           VALUES(${this.id}, '${this.status}', ${this.delivery.id}, ${this.client.id}, ${this.operatorId});`;
      dbConnection.query(insertQuery, (error, result) => {
        if (error) reject(error);
        resolve();
      });
    }));
  }
}

const getAllQuery = `
      SELECT o.*, c.*, d.*
      FROM orders o 
      JOIN client c ON o.client_id = c.id
      JOIN delivery_info d ON o.delivery_id = d.id;
`;

async function getAllItems(query=getAllQuery) {
  return new Promise(((resolve, reject) => {
    dbConnection.query(query, (error, result) => {
      if (error) reject(error);

      let orders = [];
      result.fetch("all", true, (row) => {
        let client = new Client(row.CLIENT_ID, row.FIRST_NAME, row.LAST_NAME, row.MIDDLE_NAME);
        let delivery = new Delivery(row.DELIVERY_ID, row.TYPE, row.ADDRESS);
        let order = new Order(row.ID, row.STATUS, row.ORDER_TIME, delivery, client, row.OPERATOR_ID);
        orders.push(order);
      }, (err, eof) => {
        if (err) reject(err);
        resolve(orders);
      });
    });
  }));
}

function getItemsById(ids, callback) {
  let query = `SELECT * FROM orders WHERE id IN (${ids.join(', ')});`;
  getAllItems((orders) => callback(orders), query);
}

module.exports.Order = Order;
module.exports.getAll = getAllItems;
module.exports.getByIds = getItemsById;