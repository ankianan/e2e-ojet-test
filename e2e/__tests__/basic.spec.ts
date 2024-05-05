import ojwd from '@oracle/oraclejet-webdriver';

describe('Basic test', ()=>{
    test('Basic load test', async ()=>{
        let driver = global.getDriver();
        await ojwd.get(driver, 'http://localhost:8000/')
        expect(true).toBe(false)
    })
})