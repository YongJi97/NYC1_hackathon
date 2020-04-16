const express = require('express');
const router = express.Router();

// /latest page
router
.get('/latest', function (req, res, next) {
  res.render('latest', 
  { 
    title: 'Latest'
  });
})

module.exports = router;
