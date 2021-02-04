const dbConnection = require('../firebird-controller').Connection;

class Client {
  constructor(id, firstName, lastName, middleName) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.middleName = middleName;
  }

  async save() {
    return new Promise(((resolve, reject) => {
      const insertQuery = `
        INSERT INTO client
        VALUES ('${this.firstName}', '${this.lastName}', '${this.middleName}', ${this.id});
      `;

      dbConnection.query(insertQuery, (error, result) => {
        if (error) reject(error);
        resolve();
      });
    }));
  }
}
module.exports = Client;