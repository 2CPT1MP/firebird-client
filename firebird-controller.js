const Firebird = require('firebird');
const dbConnection = Firebird.createConnection();

dbConnection.connect('localhost:/home/blade/DB/SHOP.FDB', 'SYSDBA', 'masterkey', '', (err) => {
  if (err)
    throw err;
});

module.exports.Connection = dbConnection;