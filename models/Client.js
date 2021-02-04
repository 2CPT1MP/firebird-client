const dbConnection = require('../firebird-controller').Connection;

class Client {
  constructor(id, firstName, lastName, middleName) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.middleName = middleName;
  }

  save(callback) {
    const insertQuery = `
        INSERT INTO client
        VALUES ('${this.firstName}', '${this.lastName}', '${this.middleName}', ${this.id});
    `;
    console.log(insertQuery)
    dbConnection.query(insertQuery, (error, result) => {
      if (error) throw error;
      console.log('Inserted new client');

      callback();
    });
  }
}
module.exports = Client;