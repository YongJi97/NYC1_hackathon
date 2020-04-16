const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://ncov2019.live/data'

axios.get(url)
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.log(error);
    })