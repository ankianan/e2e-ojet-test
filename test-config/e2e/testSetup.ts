import { DriverManager } from '@oracle/oraclejet-webdriver';
import { Builder, Capabilities, Browser } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import firefox from 'selenium-webdriver/firefox';

const JEST_TIMEOUT = 30000;
setup()

export function setup() {
    jest.setTimeout(JEST_TIMEOUT);
    registerConfigs();
    DriverManager.setBuilder(getBuidler());
}

function registerConfigs() {
    const firefox_capabilities = Capabilities.firefox();
    const chrome_capabilities = Capabilities.chrome();

    const ffconfig = {
        capabilities: firefox_capabilities,
        timeouts: {
            implicit: 2000
        }
    };
    


    const chromeconfig = {
        capabilities: chrome_capabilities,
        timeouts: {
            implicit: 2000
        }
    };
    const {browser} = global.testEnvironmentOptions;
    let config = browser === Browser.FIREFOX?ffconfig: chromeconfig;
    DriverManager.registerConfig(config);
    // DriverManager.registerConfig(ffconfig, 'ffconfig');
    // DriverManager.registerConfig(chromeconfig, 'chromeconfig');
}

function getBuidler() {

    const {headless} = global.testEnvironmentOptions;
    //@ts-ignore
    const chromOptions = new chrome.Options().enableBidi();
    if(headless){
        chromOptions.addArguments('--headless=new');
    }
    
    
    //@ts-ignore
    const ffOptions = new firefox.Options().enableBidi();
    if(headless){
        ffOptions.addArguments('--headless');
    }
    

    let builder = new Builder()
        .setChromeOptions(chromOptions)
        .setFirefoxOptions(ffOptions)
    return builder;
}
