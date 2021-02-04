const dbConnection = require('../firebird-controller').Connection;

class OrderDetails {
    constructor(itemQuantityMap, orderId) {
        this.itemQuantityMap = itemQuantityMap;
        this.orderId = orderId;
    }

    save(callback) {
       let insertBatchRequest = `
            EXECUTE BLOCK AS BEGIN\n
       `;

        for (let item of this.itemQuantityMap) {
            insertBatchRequest += `INSERT INTO order_contents VALUES (${item.id}, ${this.orderId}, ${item.quantity});\n`;
        }
        insertBatchRequest += `END`;
        console.log(insertBatchRequest);
        dbConnection.query(insertBatchRequest, (error, result) => {
            if (error) throw error;
            console.log('Inserted all order details');
            callback();
        });
    }
}

module.exports = OrderDetails;