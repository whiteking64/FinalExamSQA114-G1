const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
const path = require('path');
const os = require('os');
const fs = require('fs');

// Create a unique temporary directory for Chrome profile
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-profile-'));

let options = new chrome.Options();
options.addArguments('--headless=new'); // Use 'new' mode for compatibility
options.addArguments('--no-sandbox');
options.addArguments('--disable-dev-shm-usage');
options.addArguments(`--user-data-dir=${tmpDir}`); // Prevent session collision

let driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

(async function testTicTacToe() {
    try {
        const testingUrl = process.env.TESTING_URL || 'http://localhost';

        console.log('Navigating to:', testingUrl);
        await driver.get(testingUrl);

        // Wait for the game board to load
        await driver.wait(until.elementLocated(By.id('cell0')), 10000);

        // Click on a few cells
        await driver.findElement(By.id('cell0')).click();
        await driver.sleep(500);
        await driver.findElement(By.id('cell1')).click();  // Likely ignored since computer moves
        await driver.sleep(500);
        await driver.findElement(By.id('cell2')).click();

        // Check the score element exists
        const scoreElement = await driver.findElement(By.id('player_score'));
        const scoreText = await scoreElement.getText();

        console.log('Player score text:', scoreText);

        // Simple assertion: the score box should exist and contain a number
        assert.ok(!isNaN(parseInt(scoreText)), 'Score text is not a number');

        console.log('✅ Selenium test passed');
    } catch (err) {
        console.error('❌ Selenium test failed:', err);
        process.exit(1);
    } finally {
        await driver.quit();
    }
})();
