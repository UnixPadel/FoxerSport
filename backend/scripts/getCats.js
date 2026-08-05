import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

async function run() {
  const browser = await puppeteer.launch({headless: 'new', args: ['--no-sandbox']});
  const page = await browser.newPage();
  await page.goto('https://foxersport.com/', {waitUntil: 'domcontentloaded'});
  const html = await page.content();
  const $ = cheerio.load(html);
  const links = [];
  $('a').each((i, el) => {
    const href = $(el).attr('href');
    if(href && href.includes('route=product/category')) links.push(href);
  });
  console.log([...new Set(links)].join('\n'));
  await browser.close();
}
run();
