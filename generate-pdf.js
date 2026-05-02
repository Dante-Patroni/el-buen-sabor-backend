const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`file://${__dirname}/api-docs.html`, { waitUntil: 'networkidle0' });
  await page.pdf({ path: 'api-docs.pdf', format: 'A4' });
  await browser.close();
  console.log('PDF generado: api-docs.pdf');
})();