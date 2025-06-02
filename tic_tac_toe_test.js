const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const TESTING_URL = process.env.TESTING_URL || 'http://localhost';

(async function testTicTacToe() {
  console.log(`Navigating to: ${TESTING_URL}`);

  let options = new chrome.Options();
  options.addArguments('--headless=new'); // Use modern headless mode
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');

  let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

  try {
    await driver.get(TESTING_URL);
    await driver.wait(until.elementLocated(By.id('table_game')), 5000);
    console.log("✅ Selenium test passed: Tic Tac Toe loaded.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Selenium test failed:", err);
    process.exit(1);
  } finally {
    await driver.quit();
  }
})();
