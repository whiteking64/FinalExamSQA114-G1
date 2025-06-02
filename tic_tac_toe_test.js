const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const os = require('os');
const fs = require('fs');
const path = require('path');

const TESTING_URL = process.env.TESTING_URL || 'http://localhost';

(async function testTicTacToe() {
  console.log(`Navigating to: ${TESTING_URL}`);

  let options = new chrome.Options();
  options.addArguments('--headless=new');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-setuid-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--disable-gpu');

  let driver;
  let userDataDir = null;

  try {
    userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-profile-'));
    console.log(`Using unique user data directory: ${userDataDir}`);
    options.addArguments(`--user-data-dir=${userDataDir}`);

    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    await driver.get(TESTING_URL);
    await driver.wait(until.elementLocated(By.id('table_game')), 5000);
    console.log("✅ Selenium test passed: Tic Tac Toe loaded.");
    process.exitCode = 0;
  } catch (err) {
    console.error("❌ Selenium test failed:", err);
    process.exitCode = 1;
  } finally {
    if (driver) {
      try {
        await driver.quit();
        console.log('Browser session closed.');
      } catch (quitErr) {
        console.error('Error quitting driver:', quitErr);
      }
    }
    if (userDataDir) {
      try {
        fs.rmSync(userDataDir, { recursive: true, force: true });
        console.log(`Cleaned up user data directory: ${userDataDir}`);
      } catch (cleanupErr) {
        console.error(`Error cleaning up user data directory ${userDataDir}:`, cleanupErr);
      }
    }
  }
})();
