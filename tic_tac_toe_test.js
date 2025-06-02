const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

(async function testTicTacToe() {
  const testingURL = process.env.TESTING_URL;

  const options = new chrome.Options();
  options.addArguments('--headless');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--disable-gpu');
  options.addArguments('--user-data-dir=/tmp/unique-data-dir');

  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    await driver.get(testingURL);
    await driver.wait(until.elementLocated(By.id('okBtn')), 10000);
    await driver.findElement(By.id('okBtn')).click();
    await driver.wait(until.elementLocated(By.id('cell0')), 5000);
    await driver.findElement(By.id('cell0')).click();

    const cell = await driver.findElement(By.id('cell0'));
    const innerHTML = await cell.getAttribute('innerHTML');

    console.log('Clicked cell content:', innerHTML);
    assert(innerHTML.includes('×'), 'Expected cell content to contain "×"');
    console.log('✅ Test passed: "×" is correctly displayed when user chooses X');

  } catch (err) {
    console.error('❌ Test failed:', err);
  } finally {
    await driver.quit();
  }
})();
