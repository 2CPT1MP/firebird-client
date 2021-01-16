const Express = require('express');
const BodyParser = require('body-parser');

const ordersRouter = Express.Router();
const jsonParser = BodyParser.json();


ordersRouter.put( '/', jsonParser, (req, res) => {
  console.log(req.body);
  res.redirect('/');
});


module.exports = ordersRouter;