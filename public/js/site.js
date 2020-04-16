import axios from 'axios';
import cheerio from 'cheerio';

export async function scrapeRealtor() {
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