const puppeteer = require('puppeteer');

(async () => {
    try {
        console.log("Launching browser for verification...");
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });

        console.log("Navigating to Homepage...");
        await page.goto('http://localhost:5500', { waitUntil: 'networkidle0' });
        await page.screenshot({ path: 'homepage_cinematic.png' });
        console.log("Homepage screenshot taken.");

        console.log("Navigating to Discover (Filter) Page...");
        await page.goto('http://localhost:5500/movies/filter', { waitUntil: 'networkidle0' });
        await page.screenshot({ path: 'discover_cinematic.png' });
        console.log("Discover page screenshot taken.");

        console.log("Navigating to Login Page...");
        await page.goto('http://localhost:5500/login', { waitUntil: 'networkidle0' });
        await page.screenshot({ path: 'login_cinematic.png' });
        console.log("Login page screenshot taken.");

        console.log("Navigating to Signup Page...");
        await page.goto('http://localhost:5500/signup', { waitUntil: 'networkidle0' });
        await page.screenshot({ path: 'signup_cinematic.png' });
        console.log("Signup page screenshot taken.");

        // Ensure to close browser
        await browser.close();
        console.log("Verification complete.");
    } catch (e) {
        console.error("Puppeteer encountered an error:", e);
        process.exit(1);
    }
})();
