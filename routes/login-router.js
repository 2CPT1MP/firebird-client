const Express = require('express');

const router = Express.Router();

router.get('/', (req, res) => {
  res.redirect('login.html');
});

module.exports = router;
