const parentDir = require('path').resolve(__dirname, '..');
const configPath = parentDir + '/.env';
require('dotenv').config({ path: configPath });
const puppeteer = require('puppeteer');

(async () => {
    try {
        const url = "https://www.strava.com/login";
        // If running this in Docker:
        // const browser = await puppeteer.launch({executablePath: 'google-chrome-unstable', args: ['--no-sandbox']});
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        console.log("New browser window opened");
        
        await page.setViewport({width: 1200, height: 720});
        console.log("Viewport set");
        
        await page.goto(url, { waitUntil: 'networkidle0' });
        console.log("Visited URL, network now idle");
        ``
        await page.waitForSelector('#password', { visible: true });
        await page.type('#email', process.env.STRAVA_USERNAME);
        await page.type('#password', process.env.STRAVA_PASSWORD);
        console.log("Found email and password inputs");
        
        await page.click('#login-button');
        console.log("Clicked login");
    
        // Waiting 4 seconds seems to make this more reliable
        await page.waitForTimeout(4000);
        console.log("Waited 4 seconds, now waiting for network idle");

        await page.waitForNetworkIdle();

        const textContent = await page.evaluate(() => {
            let ctr = 0;
            const notifications = document.querySelector("#notifications-button");
            if (notifications) {
                notifications.click();
            }
            const kudosButtons = document.querySelectorAll('button[data-testid="kudos_button"]');
            kudosButtons.forEach((btn) => {
                btn.click();
                ctr++;
            });
            return {
                length: kudosButtons.length,
                clicks: ctr
            };        
        });
        console.log(textContent, "Clicked notifications button and all like buttons");
        await browser.close();
    } catch (err) {
        console.log("Yikes. Something's wrong.", err);
        process.exit(1);
    }
})();