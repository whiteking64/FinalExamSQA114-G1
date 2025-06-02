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

    // Wait for the options modal to be visible and click the "Play" button
    console.log("Waiting for options modal...");
    await driver.wait(until.elementLocated(By.id('optionsDlg')), 10000); // Wait for the modal itself
    await driver.wait(until.elementIsVisible(driver.findElement(By.id('optionsDlg'))), 10000);
    console.log("Options modal located. Waiting for Play button...");
    const playButton = await driver.wait(until.elementLocated(By.id('okBtn')), 10000);
    await driver.wait(until.elementIsVisible(playButton), 10000);
    await driver.wait(until.elementIsEnabled(playButton), 10000);
    console.log("Play button located and interactable. Clicking Play button...");
    await playButton.click();
    console.log("Play button clicked. Waiting for options modal to disappear...");
    await driver.wait(until.stalenessOf(driver.findElement(By.id('optionsDlg'))), 10000); // Wait for modal to be gone

    console.log("Waiting for table_game element...");
    await driver.wait(until.elementLocated(By.id('table_game')), 15000); // Increased timeout
    console.log("✅ Selenium test passed: Tic Tac Toe loaded and options modal handled.");
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
