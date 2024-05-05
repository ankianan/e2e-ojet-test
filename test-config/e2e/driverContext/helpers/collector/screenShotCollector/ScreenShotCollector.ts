import { WebDriver } from "selenium-webdriver";
import ICollector from "../BaseCollector";
import {ScreenshotManager} from '@oracle/oraclejet-webdriver';
import BaseCollector from "../BaseCollector";
let scm = ScreenshotManager.create(BaseCollector.getRootLocation())

export class ScreenshotCollector extends BaseCollector implements ICollector{
    testParentName: string;
    testName: string;
    collector: any;
    async takeAndSaveScreenShot(): Promise<void> {
        if(this.testParentName && this.testName){
            return scm.takeAndSaveScreenShot(this.driver, "image");
        }
    }
    async beforeTest(testParentName: string, testName: string) {
        await super.beforeTest(testParentName, testName);
        scm.beforeTest(testParentName, testName);
        this.collector = scm;
    }
    async afterTest(passed){
        if(!passed){
            await this.takeAndSaveScreenShot();
        }
        scm.afterTest(passed)
    }
}