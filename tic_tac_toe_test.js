const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
const path = require('path');
const os = require('os');
const fs = require('fs');

// Create a unique temporary directory for Chrome user data
const userDataDir = path.join(os.tmpdir(), 'selenium-profile-' + Date.now());
fs.mkdirSync(userDataDir, { recursive: true });

let options = new chrome.Options();
options.addArguments('--headless=new');
options.addArguments('--no-sandbox');
options.addArguments('--disable-dev-shm-usage');
options.addArguments('--disable-gpu');
options.addArguments('--disable-extensions');
options.addArguments('--disable-background-networking');
options.addArguments('--disable-default-apps');
options.addArguments('--disable-sync');
options.addArguments('--metrics-recording-only');
options.addArguments('--remote-debugging-port=9222');
options.addArguments(`--user-data-dir=${userDataDir}`);

let driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

(async function testTicTacToe() {
    try {
        const testingUrl = process.env.TESTING_URL || 'http://localhost';
        console.log('Navigating to:', testingUrl);
        await driver.get(testingUrl);

        // Wait for game board to appear
        await driver.wait(until.elementLocated(By.id('cell0')), 10000);

        // Play simple sequence
        await driver.findElement(By.id('cell0')).click();
        await driver.sleep(500);
        await driver.findElement(By.id('cell2')).click();

        // Check scoreboard
        const scoreElement = await driver.findElement(By.id('player_score'));
        const scoreText = await scoreElement.getText();

        console.log('Player score text:', scoreText);
        assert.ok(!isNaN(parseInt(scoreText)), 'Score is not a number');

        console.log('✅ Selenium test passed');
    } catch (err) {
        console.error('❌ Selenium test failed:', err);
        process.exit(1);
    } finally {
        await driver.quit();
    }
})();
