const Firebird = require('firebird');
const dbConnection = Firebird.createConnection();

dbConnection.connect('192.168.1.3:C:\\SHOP.FDB', 'SYSDBA', 'masterkey', '', (err) => {
  if (err)
    throw err;
});

module.exports.Connection = dbConnection;