const chromium = require('@sparticuz/chromium');

let puppeteer;
if (process.env.IS_LOCAL === 'true') {
  puppeteer = require('puppeteer'); // full version for local dev
} else {
  puppeteer = require('puppeteer-core'); // lightweight for AWS Lambda
}

module.exports.screenshot = async (event) => {
  let browser = null;

  const path = await chromium.executablePath();
  console.log('path: ', path);
  
  try {
    browser = await puppeteer.launch(
      process.env.IS_LOCAL === 'true'
        ? {
            headless: true,
          }
        : {
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: path, 
            headless: chromium.headless,
          }
    );

    const page = await browser.newPage();
    await page.goto('https://example.com', { waitUntil: 'networkidle2' });

    const screenshot = await page.screenshot({ encoding: 'base64' });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'image/png' },
      body: screenshot,
      isBase64Encoded: true,
    };
  } finally {
    if (browser) await browser.close();
  }
};

