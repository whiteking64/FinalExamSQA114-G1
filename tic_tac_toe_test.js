const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
const path = require('path');
const os = require('os');
const fs = require('fs');

// Minimal working options for CI/EC2
const options = new chrome.Options()
  .addArguments('--headless=new')
  .addArguments('--no-sandbox')
  .addArguments('--disable-dev-shm-usage')
  .addArguments('--disable-gpu')
  .addArguments('--disable-software-rasterizer');

// Create WebDriver with safe options
const driver = new Builder()
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
