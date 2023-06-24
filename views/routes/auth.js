const express = require('express');
const router = express.Router();


//루트 실행
router.get('/', (req, res) => {
  res.render('pages/index', { title: 'EVOS' });
});


module.exports = router;