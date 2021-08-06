require('dotenv').config({ path: __dirname + '/.env' });
const puppeteer = require('puppeteer');

async function main() {
    try {
        const url = "https://www.strava.com/login";
        const browser = await puppeteer.launch({executablePath: '/usr/bin/chromium-browser', args: ['--no-sandbox']});
        const page = await browser.newPage();
        await page.setViewport({width: 1200, height: 720});
        await page.goto(url, { waitUntil: 'networkidle0' }); // wait until page load
        await page.type('#email', process.env.USERNAME);
        await page.type('#password', process.env.PASSWORD);
        // click and wait for navigation
        await Promise.all([
                page.click('#login-button'),
                page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ]);
        const textContent = await page.evaluate(() => {
            let ctr = 0;
            const notifications = document.querySelector("#notifications-button");
            if (notifications) {
                notifications.click();
            }
            const kudosButtons = document.querySelectorAll('button[data-testid]');
            kudosButtons.forEach((btn) => {
                btn.click();
                ctr++;
            });
            return {
                length: kudosButtons.length,
                clicks: ctr
            };        
        });
        await browser.close();
    } catch (err) {
        console.log("Yikes. Something's wrong.", err);
    }
}

main();