import ojwd from '@oracle/oraclejet-webdriver';
import {ojInputText, ojCollapsible} from '@oracle/oraclejet-webdriver/elements';
import {By, WebDriver, until} from 'selenium-webdriver';

describe('Basic test', ()=>{
    test('Test value changing to capital', async ()=>{
        let driver:WebDriver = global.getDriver();
        await ojwd.get(driver, 'http://localhost:8000/')
        let node_collapsible = await ojCollapsible(driver, By.css('oj-collapsible'));
        await node_collapsible.doExpand();
        let node = await ojInputText(driver, By.css('oj-input-text'));
        await node.changeValue('hello world')
        expect(await node.getValue()).toBe('HELLO WORLD');
    })
})