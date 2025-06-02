const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const TESTING_URL = process.env.TESTING_URL || 'http://localhost';

(async function testTicTacToe() {
  console.log(`Navigating to: ${TESTING_URL}`);

  let options = new chrome.Options();
  options.addArguments('--headless=new');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--disable-gpu');

  let driver;
  try {
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
      await driver.quit();
    }
  }
})();
