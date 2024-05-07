import ojwd, {DriverManager} from '@oracle/oraclejet-webdriver';
import {ojInputText, ojCollapsible} from '@oracle/oraclejet-webdriver/elements';
import {By, WebDriver, until} from 'selenium-webdriver';

describe('Basic test', ()=>{
    let driver: WebDriver;

    beforeEach(async ()=>{
        driver= await DriverManager.getDriver();
        await global.setDriver(driver);
    })

    afterEach(async ()=>{
        await global.releaseDriver()
    })

    test('Test value changing to capital', async ()=>{
        await ojwd.get(driver, 'http://localhost:8000/')
        let node_collapsible = await ojCollapsible(driver, By.css('oj-collapsible'));
        await node_collapsible.doExpand();
        let node = await ojInputText(driver, By.css('oj-input-text'));
        await node.changeValue('hello world')
        expect(await node.getValue()).toBe('HELLO WORLD');
    })
})