const dbConnection = require('../firebird-controller').Connection;
const MenuItem = require('../models/MenuItems').MenuItem;

class OrderDetails {
    constructor(itemQuantityMap, orderId, itemList=[]) {
        this.itemQuantityMap = itemQuantityMap;
        this.orderId = orderId;
        this.itemList = itemList;
    }

    addMenuItem(item) {
        this.itemList.push(item);
    }

    async save() {
        return new Promise(((resolve, reject) => {
            let insertBatchRequest = `EXECUTE BLOCK AS BEGIN\n`;

            for (let item of this.itemQuantityMap) {
                insertBatchRequest += `INSERT INTO order_contents VALUES (${item.id}, ${this.orderId}, ${item.quantity});\n`;

            }
            insertBatchRequest += `END`;
            console.log(insertBatchRequest);

            dbConnection.query(insertBatchRequest, (error, result) => {
                if (error) reject(error);
                resolve(result);
            });
        }));
    }

    static async getByOrderId(id) {
        return new Promise(((resolve, reject) => {
            const query = `
                SELECT item_id, title, price, amount
                FROM order_contents
                JOIN menu_item ON item_id = menu_item.id
                WHERE order_id = id;
            `;

            dbConnection.query(query, (error, result) => {
                if (error) reject(error);
                const orderDetails = new OrderDetails(null, id);

                result.fetch("all", true, (row) => {
                    const orderItem = new MenuItem(row.ITEM_ID, row.TITLE, row.PRICE, row.AMOUNT);
                    orderDetails.addMenuItem(orderItem);
                }, (err, eof) => {
                    if (err) reject(err);
                    resolve(orderDetails);
                });
            });
        }));
    }
}

module.exports = OrderDetails;