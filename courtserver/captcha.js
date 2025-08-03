const puppeteer = require('puppeteer');

async function getCaptchaFromCourt() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto('https://dhcmisc.nic.in/pcase/guiCaseWise.php', {
      waitUntil: 'networkidle2',
    });
     console.log("I am working")
    const captchaText = await page.$eval('#cap', el => el.innerText.trim());
    console.log(captchaText)
    await browser.close();

    return  captchaText ;
  } catch (err) {
    await browser.close();
    console.error('Error fetching CAPTCHA:', err.message);
    throw new Error('Failed to retrieve CAPTCHA');
  }
}

module.exports = getCaptchaFromCourt;
