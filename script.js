const { Builder, By, Key, until } = require('selenium-webdriver');
const path = require('path');
const chrome = require('selenium-webdriver/chrome');

async function checkEmailExists(email) {
  // Step 1: Open Chrome browser
  const driverPath = path.resolve('./chromedriver'); // Replace 'path/to/chromedriver' with the absolute path to the chromedriver executable
  const driver = await new Builder()
  .forBrowser('chrome')
//   .setChromeOptions(new chrome.Options().addArguments('--headless'))
  .setChromeService(new chrome.ServiceBuilder(driverPath))
  .build();

  try {
    // Step 2: Access https://www.google.com/accounts/recovery
    await driver.get('https://www.google.com/accounts/recovery');

    // Step 3: Fill in email and hit submit
    await driver.findElement(By.name('identifier')).sendKeys(email, Key.RETURN);

    // Step 4: Wait for the response
    // Wait for the error message to appear
    const errorMessageElement = await driver.wait(
        until.elementLocated(By.xpath('//div[contains(text(), "Không tìm thấy Tài khoản Google của bạn")]')),
        5000
      ).catch(() => undefined);
  
      if (errorMessageElement === undefined) {
        await driver.quit();
        return 'Email exists in Google';
      }
  
      await driver.quit();
      return 'Email does not exist in Google';
  } catch (error) {
    console.error('An error occurred:', error);
    await driver.quit();
    return 'Error occurred during execution';
  }
}

// Usage example:
const email = 'dangtrannam2001@gmail.com';
checkEmailExists(email).then((result) => {
  console.log(result);
});
