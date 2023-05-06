const parentDir = require('path').resolve(__dirname, '..');
const configPath = parentDir + '/.env';
require('dotenv').config({ path: configPath });
const puppeteer = require('puppeteer');

(async () => {
    try {
        const url = "https://www.strava.com/login";
        const seconds = 10;
        /** If running this in Docker:
        const browser = await puppeteer.launch({executablePath: 'google-chrome-unstable', args: ['--no-sandbox']});
        
        To test visually, set headless to false 
        const browser = await puppeteer.launch({args: ['--disable-web-security',], headless: false}); */
        const browser = await puppeteer.launch({args: ['--disable-web-security',]});
        const page = await browser.newPage();
        console.log("New browser window opened");
        
        await page.setViewport({width: 1200, height: 1220});
        console.log("Viewport set");
        
        await page.goto(url, { waitUntil: 'networkidle0' });
        console.log("Visited URL, network now idle");

        await page.waitForSelector('#password', { visible: true });
        await page.type('#email', process.env.STRAVA_USERNAME);
        await page.type('#password', process.env.STRAVA_PASSWORD);
        console.log("Found email and password inputs");
        
        await page.click('#login-button');
        console.log("Clicked login");

        // Waiting x seconds seems to make this more reliable than waiting for Network Idle or a selector
        await page.waitForTimeout(seconds * 1000);
        console.log(`Waited ${seconds} seconds`);

        
        const notificationsButtonSelector = `button[class^="src-Notifications"]`;
        const kudosButtonsSelector = `button[data-testid="kudos_button"]`;


        if (notificationsButtonSelector) {
            // Attempt to click notifications button directly
            await page.click(notificationsButtonSelector);
        }
        
        // An alternate method to evaluate the page...sometimes this seems to work better.
        await page.$$eval(kudosButtonsSelector, results => {
            return results.map(result => result.click() );
        });      


        // Page evaluate works most of the time when trying to click buttons...but then sometimes it doesn't
        await page.evaluate(() => {
            const notifications = document.querySelector(`button[class^="src-Notifications__nav-bar-button"]`);
            if (notifications) {
                notifications.click();
            }
            const kudosButtons = document.querySelectorAll(`button[data-testid="kudos_button"]`);
            kudosButtons.forEach((btn) => {
                btn.click();
            });
        });
 
        console.log("Clicked notifications button and all like buttons");
        await browser.close();
    } catch (err) {
        console.log("Yikes. Something's wrong.", err);
        process.exit(1);
    }
})();
