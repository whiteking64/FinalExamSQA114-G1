const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function runTest() {
  let options = new chrome.Options();

  options.addArguments(
    '--headless=new',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu'
  );

  const testUrl = process.env.TESTING_URL;

  let driver;
  try {
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    console.log(`Navigating to: ${testUrl}`);
    await driver.get(testUrl);

    await driver.wait(until.titleContains("Tic Tac Toe"), 10000);
    console.log("Page loaded successfully");

  } catch (err) {
    console.error("Selenium test failed:", err);
    process.exit(1);
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
})();
