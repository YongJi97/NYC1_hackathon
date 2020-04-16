require('dotenv').config()
var express = require('express');
var logger = require('morgan');
var app = express();
var fs = require("fs");
var axios = require('axios');
var cheerio = require('cheerio');

// Load in config data stuff and pass to app locals 
var config = require('./config');
app.locals = config;

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Set up logging
if (app.get('env') === 'production') {
    app.use(logger('combined'));
  } else {
    app.use(logger('dev'));
}
console.log(`### Node environment mode is '${app.get('env')}'`);

// Serve static content
app.use('/public', express.static('public'))

// Routing to controllers
var route_path = "./routes/";
fs.readdirSync(route_path).forEach( function(file) {
  console.log(`### Loading routes from ${route_path}${file}`);
  var route = require(route_path + file);
  app.use('/', route);
});

// Start the server, wow!
var port = process.env.PORT ||  3000
app.listen(port);
console.log(`### Server listening on port ${port}`);



async function scrapeRealtor() {
    const html = await axios.get('https://ncov2019.live/data');
    const $ = await cheerio.load(html.data);
    let data = [];
  
    $('p').each((i, elem) => {
      if (i <= 3) {
        data.push({
          title: $(elem).text()
        })
      }
    });
  
    console.log(data);
  }