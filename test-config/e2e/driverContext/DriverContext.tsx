import { WebDriver } from 'selenium-webdriver';
import { DriverManager } from '@oracle/oraclejet-webdriver';
import { LogCollector } from "./helpers/collector/logCollector/LogCollector";
import { HarCollector } from './helpers/collector/harCollector/HarCollector';
import { ScreenshotCollector } from './helpers/collector/screenShotCollector/ScreenShotCollector';

export class DriverContext {
    driver: WebDriver;
    logCollector: LogCollector;
    harCollector: HarCollector;
    screenshotCollector: ScreenshotCollector;
    isReleased = false;
    constructor(driver: WebDriver){
        this.driver = driver;
        this.#setupColelctors();
    }
    #setupColelctors() {
        this.logCollector = new LogCollector(this.driver);
        this.harCollector = new HarCollector(this.driver);
        this.screenshotCollector = new ScreenshotCollector(this.driver);
    }

    async beforeTest(testParentName, testName){
        await this.harCollector.beforeTest(testParentName, testName)
        await this.logCollector.beforeTest(testParentName, testName)
        await this.screenshotCollector.beforeTest(testParentName, testName)
    }
    async releaseContext(passed){
        await this.#releaseCollectors(passed);
        this.isReleased = true;
    }
    async #releaseCollectors(passed: any) {
        await this.logCollector.afterTest(passed);
        await this.harCollector.afterTest(passed);
        await this.screenshotCollector.afterTest(passed);
    }
}


export async function createDriverContext(driver: any) {
    return new DriverContext(driver);
    
}