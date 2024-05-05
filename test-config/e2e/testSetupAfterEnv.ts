import ojwd, {DriverManager} from '@oracle/oraclejet-webdriver';
import { WebDriver } from 'selenium-webdriver';



const JEST_TIMEOUT = 30000;
jest.setTimeout(JEST_TIMEOUT);


let driver:WebDriver;
beforeEach(async ()=>{
    driver = await DriverManager.getDriver('chromeconfig');
    await global.setDriver(driver);
})

afterEach(async ()=>{
    DriverManager.releaseDriver(driver);
})

const OJET_DRIVER_QUIT_TIMEOUT = 500;
afterAll((done)=>{
    setTimeout(done, OJET_DRIVER_QUIT_TIMEOUT);
})

