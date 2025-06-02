const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

(async function runTest() {
  let options = new chrome.Options();

    options.addArguments(
      '--headless=new',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-software-rasterizer'
  );

  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    const testUrl = process.env.TESTING_URL;
    console.log(`Navigating to: ${testUrl}`);
    await driver.get(testUrl);
    await driver.wait(until.titleContains("Tic Tac Toe"), 10000);
    console.log("Page loaded successfully");
  } catch (err) {
    console.error("Selenium test failed:", err);
    process.exit(1);  // Jenkins will mark this as failed
  } finally {
    await driver.quit();
  }
})();
