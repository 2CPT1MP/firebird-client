const Express = require('express');
const itemsRouter = require('./routes/items-router');
const ordersRouter = require('./routes/orders-router');

const PORT = process.env.PORT || 5000;
const app = Express();

app.use(Express.static('./public'));
app.set('view engine', 'ejs');

app.use('/', itemsRouter);
app.use('/orders', ordersRouter);

app.listen(PORT);