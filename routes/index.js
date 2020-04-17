const express = require('express');
const router = express.Router();

// Index and root
router
.get('/', function (req, res, next) {
  res.render('index', 
  { 
    title: 'Home'
  });
})

router
.get('/chat', function (req, res, next) {
  res.render('chat', 
  { 
    title: 'Chat'
  });
})

module.exports = router;
