const dbConnection = require('../firebird-connection');

class Delivery {
  constructor(id, type, address) {
    this.id = id;
    this.type = type;
    this.address = address;
  }

  async save() {
    return new Promise(((resolve, reject) => {
      const insertQuery = `
        INSERT INTO delivery_info
        VALUES (${this.id}, '${this.type}', '${this.address}');
      `;

      dbConnection.query(insertQuery, (error, result) => {
        if (error) reject(error);
        resolve();
      });
    }));
  }
}

module.exports = Delivery;