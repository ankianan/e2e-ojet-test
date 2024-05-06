import { DriverManager } from '@oracle/oraclejet-webdriver';
import { Builder, Capabilities } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import firefox from 'selenium-webdriver/firefox';


setup()

export function setup() {
    registerConfigs();
    DriverManager.setBuilder(getBuidler());
}

function registerConfigs() {
    const firefox_capabilities = Capabilities.firefox();
    const chrome_capabilities = Capabilities.chrome();

    DriverManager.registerConfig({
        capabilities: firefox_capabilities,
        timeouts: {
            implicit: 2000
        }
    }, 'ffconfig');


    DriverManager.registerConfig({
        capabilities: chrome_capabilities,
        timeouts: {
            implicit: 2000
        }
    }, 'chromeconfig');
}

function getBuidler() {

    //@ts-ignore
    const chromOptions = new chrome.Options().enableBidi();
    //chromOptions.addArguments('--headless=new');
    
    //@ts-ignore
    const ffOptions = new firefox.Options().enableBidi();
    ffOptions.addArguments('--headless');

    let builder = new Builder()
        .setChromeOptions(chromOptions)
        .setFirefoxOptions(ffOptions)
    return builder;
}
