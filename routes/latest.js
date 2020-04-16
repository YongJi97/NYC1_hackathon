let cheerio = require('cheerio');
let axios = require('axios');

const express = require('express');
const router = express.Router();
let app = express();

let stats = {};

scrapeRealtor();

// /latest page
router
.get('/latest', function (req, res, next) {
  res.render('latest', 
  { 
    title: 'Latest',
    data : stats
  });
})


async function scrapeRealtor() {
  const html = await axios.get('https://ncov2019.live/data');
  const $ = await cheerio.load(html.data);
  let data = [];

  $('p').each((i, elem) => {
    data.push({
      info: $(elem).text()
    })
  });

  for(let i = 0; i < data.length; i++){
    if(data[i].info.trim() === "Total Confirmed Cases"){
      stats["totalConfirmed"] = data[i-1].info.trim();
    }
    if(data[i].info.trim() === "Total Deceased"){
      stats["totalDeceased"] = data[i-1].info.trim();
    }
    if(data[i].info.trim() === "Total Tested"){
      stats["totalTested"] = data[i-1].info.trim();
    }
    if(data[i].info.trim() === "Total Recovered"){
      stats["totalRecovered"] = data[i-1].info.trim();
    }
  }

  console.log(stats);
}


module.exports = router;

