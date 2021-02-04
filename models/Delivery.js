const dbConnection = require('../firebird-controller').Connection;

class Delivery {
  constructor(id, type, address) {
    this.id = id;
    this.type = type;
    this.address = address;
  }

  save(callback) {
    const insertQuery = `
        INSERT INTO delivery_info
        VALUES (${this.id}, '${this.type}', '${this.address}');
    `;
    console.log(insertQuery);
    dbConnection.query(insertQuery, (error, result) => {
      if (error) throw error;
      console.log('Inserted new delivery info');
      callback();
    });
  }
}

module.exports = Delivery;