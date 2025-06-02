const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

(async function testTicTacToe() {
  const testingURL = process.env.TESTING_URL;

  let driver = await new Builder().forBrowser('chrome').build();

  try {
    // Step 1: Open page
    await driver.get(testingURL);

    // Step 2: Wait for modal and click "Play" with default X
    await driver.wait(until.elementLocated(By.id('okBtn')), 10000);
    await driver.findElement(By.id('okBtn')).click();

    // Step 3: Click top-left cell (id="cell0")
    await driver.wait(until.elementLocated(By.id('cell0')), 5000);
    await driver.findElement(By.id('cell0')).click();

    // Step 4: Wait and check that the innerHTML contains "×"
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
